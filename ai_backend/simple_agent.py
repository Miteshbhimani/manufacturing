import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from products_database import PRODUCTS_DATABASE, get_all_product_names, get_products_by_category, search_products
from dynamic_products import DynamicProductFetcher

load_dotenv(override=True)

class SimpleAIAgent:
    def __init__(self, model_name="openai/gpt-4o-mini", use_dynamic_data=True):
        self.llm = ChatOpenAI(
            openai_api_base="https://openrouter.ai/api/v1",
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            model=model_name,
            temperature=0,
        )
        
        self.use_dynamic_data = use_dynamic_data
        self.dynamic_fetcher = DynamicProductFetcher() if use_dynamic_data else None
        
        # Get product data (dynamic or static)
        if use_dynamic_data:
            try:
                product_names = self.dynamic_fetcher.get_product_names()
                shell_castings = product_names.get('shell_castings', [])
                pumps = product_names.get('pumps', []) + product_names.get('pump_components', [])
                precision_components = product_names.get('precision_components', [])
                industrial_castings = product_names.get('industrial_castings', [])
                
                # Fallback to static if dynamic returns empty
                if not any([shell_castings, pumps, precision_components, industrial_castings]):
                    print("Dynamic fetch returned empty, using static data...")
                    shell_castings = get_products_by_category("shell_castings")
                    pumps = get_products_by_category("pumps") + get_products_by_category("pump_components")
                    precision_components = get_products_by_category("precision_components")
                    industrial_castings = get_products_by_category("industrial_castings")
            except Exception as e:
                print(f"Error fetching dynamic data: {e}, using static data...")
                shell_castings = get_products_by_category("shell_castings")
                pumps = get_products_by_category("pumps") + get_products_by_category("pump_components")
                precision_components = get_products_by_category("precision_components")
                industrial_castings = get_products_by_category("industrial_castings")
        else:
            shell_castings = get_products_by_category("shell_castings")
            pumps = get_products_by_category("pumps") + get_products_by_category("pump_components")
            precision_components = get_products_by_category("precision_components")
            industrial_castings = get_products_by_category("industrial_castings")
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", f"""You are a helpful AI chatbot for Nucleus Metal Cast Private Limited, a manufacturing company.
            You provide information about manufacturing services, products, and company information ONLY.
            Be professional, helpful, and accurate. You can ONLY answer questions about:
            - Company-specific information (GSTIN, address, contact details)
            - Manufacturing processes and techniques (related to company's services)
            - Company products and services
            - Website content and features
            - Industry-related topics that are relevant to the company's business
            
            The company specializes in shell casting, pump manufacturing, and precision industrial components.
            
            COMPREHENSIVE PRODUCT CATALOG:
            
            ## Shell Castings
            {chr(10).join([f"- {product}" for product in shell_castings])}
            
            ## Pumps and Pump Components
            {chr(10).join([f"- {product}" for product in pumps])}
            
            ## Precision Industrial Components
            {chr(10).join([f"- {product}" for product in precision_components])}
            
            ## Industrial Castings
            {chr(10).join([f"- {product}" for product in industrial_castings])}
            
            RESTRICTIONS: 
            - DO NOT answer general questions unrelated to the company, manufacturing, or industry
            - If asked about general topics, politely redirect to company-related questions
            - For off-topic questions, respond: "I can only help with questions related to Nucleus Metal Cast Private Limited, our manufacturing services, products, or industry-specific information. Please ask about our company, shell casting, pump manufacturing, or related topics."
            
            COMPANY INFORMATION:
            - Company Name: Nucleus Metal Cast Private Limited
            - GSTIN: 24AAFCN3454D1ZP
            - Specialization: Shell casting, pump manufacturing, precision industrial components
            
            IMPORTANT: Format your responses in a user-friendly way:
            - Use proper headings (##) for main topics
            - Use bullet points or numbered lists for processes, steps, or features
            - Use bold text (**text**) for important terms
            - Keep paragraphs short and easy to read
            - Use proper spacing between sections
            - For technical processes, break down into clear sections with headings
            - When asked about company details like GSTIN, provide the specific information directly
            - When asked for product names, provide specific product names from the catalog above, not just categories
            - For off-topic questions, use the restricted response message"""),
            ("user", "{input}")
        ])
        
        self.chain = self.prompt | self.llm | StrOutputParser()

    def search_products_dynamically(self, query):
        """Search for products using dynamic fetcher if available"""
        if self.use_dynamic_data and self.dynamic_fetcher:
            try:
                results = self.dynamic_fetcher.search_products(query)
                if results:
                    return results
            except Exception as e:
                print(f"Dynamic search failed: {e}")
        
        # Fallback to static search
        static_results = search_products(query)
        return [{"title": product, "description": "Static product data"} for product in static_results]
    
    def get_detailed_product_info(self, product_name):
        """Get detailed information about a specific product"""
        if self.use_dynamic_data and self.dynamic_fetcher:
            try:
                products_data = self.dynamic_fetcher.fetch_all_products()
                for category, products in products_data.items():
                    for product in products:
                        if product_name.lower() in product['title'].lower():
                            return product
            except Exception as e:
                print(f"Failed to get detailed product info: {e}")
        
        return None
    
    def chat(self, user_query, chat_history=None):
        try:
            # Check if this is a product-specific query
            product_keywords = ['product', 'pump', 'casting', 'component', 'shell', 'part']
            is_product_query = any(keyword in user_query.lower() for keyword in product_keywords)
            
            if is_product_query and self.use_dynamic_data:
                # Try to get dynamic product information
                search_results = self.search_products_dynamically(user_query)
                if search_results:
                    # Format dynamic results for the response
                    product_info = "\n\n".join([
                        f"**{result['title']}**\n{result['description'][:200]}...\nCategory: {result['category']}"
                        for result in search_results[:3]
                    ])
                    
                    enhanced_query = f"{user_query}\n\nHere are some relevant products from our website:\n{product_info}"
                    response = self.chain.invoke({"input": enhanced_query})
                    return response
            
            # Default response using the chain
            response = self.chain.invoke({"input": user_query})
            return response
            
        except Exception as e:
            # Check if it's an authentication error
            if "401" in str(e) or "User not found" in str(e):
                return """I apologize, but I'm currently experiencing technical difficulties with my AI service. 

However, I can still help you with basic information about Nucleus Metal Cast Private Limited:

**Company Information:**
- **Company Name:** Nucleus Metal Cast Private Limited
- **GSTIN:** 24AAFCN3454D1ZP
- **Specialization:** Shell casting, pump manufacturing, and precision industrial components

**Our Products:**
- Shell Castings
- Pumps and Pump Components
- Precision Industrial Components
- Industrial Castings

**Contact Information:**
Please visit our website or contact us directly for detailed product information and inquiries.

I apologize for the inconvenience and appreciate your understanding."""
            else:
                return f"I apologize, but I'm experiencing technical difficulties. Please try again later or contact us directly. Error: {str(e)}"

if __name__ == "__main__":
    agent = SimpleAIAgent()
    print(agent.chat("What products do you manufacture?"))
