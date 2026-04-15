import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from products_database import PRODUCTS_DATABASE, get_all_product_names, get_products_by_category, search_products
from dynamic_products import DynamicProductFetcher
from crawler import WebsiteCrawler

load_dotenv(override=True)

class SimpleAIAgent:
    def __init__(self, model_name="meta-llama/llama-3.2-3b-instruct:free", use_dynamic_data=True):
        self.llm = ChatOpenAI(
            openai_api_base="https://openrouter.ai/api/v1",
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            model=model_name,
            temperature=0,
        )
        
        self.use_dynamic_data = use_dynamic_data
        self.dynamic_fetcher = DynamicProductFetcher() if use_dynamic_data else None
        self.website_crawler = WebsiteCrawler("https://benevolent-bavarois-0cadab.netlify.app/")
        self.cached_website_data = None
        
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
    
    def fetch_website_data(self):
        """Fetch real-time data from website"""
        try:
            if self.cached_website_data is None:
                print("Fetching fresh website data...")
                self.website_crawler.crawl()
                self.cached_website_data = self.website_crawler.get_all_content()
                print(f"Fetched {len(self.cached_website_data)} pages from website")
            return self.cached_website_data
        except Exception as e:
            print(f"Error fetching website data: {e}")
            return []
    
    def search_website_content(self, query):
        """Search website content for relevant information"""
        website_data = self.fetch_website_data()
        if not website_data:
            return []
        
        query_lower = query.lower()
        relevant_content = []
        
        for page in website_data:
            content_lower = page['content'].lower()
            if any(word in content_lower for word in query_lower.split() if len(word) > 2):
                relevant_content.append({
                    'url': page['url'],
                    'content': page['content'][:500] + '...' if len(page['content']) > 500 else page['content']
                })
        
        return relevant_content[:3]  # Return top 3 relevant pages
    
    def chat(self, user_query, chat_history=None):
        # First, always fetch and analyze website data
        print("Analyzing website data for response...")
        website_results = self.search_website_content(user_query)
        
        # Build comprehensive website context
        website_data_context = ""
        if website_results:
            website_data_context = "\n\nRelevant information from our website:\n"
            for result in website_results:
                website_data_context += f"- Source: {result['url']}\nContent: {result['content']}\n"
        
        # Get all website content for comprehensive analysis
        all_website_data = self.fetch_website_data()
        full_website_context = ""
        if all_website_data:
            full_website_context = "\n\nComplete website analysis:\n"
            for page in all_website_data[:10]:  # Limit to first 10 pages for context
                full_website_context += f"Page: {page['url']}\n{page['content'][:500]}...\n\n"
        
        # Check if this is a product-specific query
        product_keywords = ['product', 'pump', 'casting', 'component', 'shell', 'part']
        is_product_query = any(keyword in user_query.lower() for keyword in product_keywords)
        
        # Always try to use website data first
        if website_results or all_website_data:
            # For product queries, try to get dynamic product information
            if is_product_query and self.use_dynamic_data:
                search_results = self.search_products_dynamically(user_query)
                if search_results:
                    product_info = "\n\n".join([
                        f"**{result['title']}**\n{result['description'][:200]}...\nCategory: {result['category']}"
                        for result in search_results[:3]
                    ])
                    
                    enhanced_query = f"{user_query}\n\n{website_data_context}\n\n{full_website_context}\n\nHere are some relevant products from our website:\n{product_info}"
                    try:
                        response = self.chain.invoke({"input": enhanced_query})
                        return response
                    except Exception as e:
                        print(f"Chain invocation failed: {e}")
                        return self._format_website_based_response(search_results, website_results, all_website_data)
            
            # For non-product queries or when product search fails, use website data
            enhanced_query = f"{user_query}\n\n{website_data_context}\n\n{full_website_context}"
            try:
                response = self.chain.invoke({"input": enhanced_query})
                return response
            except Exception as e:
                print(f"Chain invocation failed: {e}")
                return self._format_website_based_response(None, website_results, all_website_data)
        
        # If no website data is available, try to fetch it
        print("No website data available, attempting to fetch...")
        try:
            self.cached_website_data = None  # Clear cache to force fresh fetch
            fresh_website_data = self.fetch_website_data()
            if fresh_website_data:
                return self.chat(user_query, chat_history)  # Retry with fresh data
        except Exception as e:
            print(f"Failed to fetch fresh website data: {e}")
        
        # Only fall back to basic response if absolutely no website data is available
        return self._format_emergency_response(user_query)
    
    def _format_product_response(self, search_results, website_context):
        """Format response with product information when chain fails"""
        response = "**Here are some relevant products from Nucleus Metal Cast:**\n\n"
        
        for result in search_results[:5]:
            response += f"**{result['title']}**\n"
            response += f"{result['description'][:300]}...\n"
            response += f"Category: {result['category']}\n\n"
        
        if website_context:
            response += website_context + "\n\n"
        
        response += "**Company Information:**\n"
        response += "- **Company Name:** Nucleus Metal Cast Private Limited\n"
        response += "- **GSTIN:** 24AAFCN3454D1ZP\n"
        response += "- **Specialization:** Shell casting, pump manufacturing, and precision industrial components\n\n"
        response += "For more detailed information, please visit our website or contact us directly."
        
        return response
    
    def _format_website_response(self, website_results):
        """Format response with website information when chain fails"""
        response = "**Information from Nucleus Metal Cast Website:**\n\n"
        
        for i, result in enumerate(website_results, 1):
            response += f"**Page {i}:** {result['url']}\n"
            response += f"{result['content']}\n\n"
        
        response += "**Company Information:**\n"
        response += "- **Company Name:** Nucleus Metal Cast Private Limited\n"
        response += "- **GSTIN:** 24AAFCN3454D1ZP\n"
        response += "- **Specialization:** Shell casting, pump manufacturing, and precision industrial components\n\n"
        response += "This information is gathered directly from our website in real-time. For more details, please visit our website or contact us directly."
        
        return response
    
    def _format_website_based_response(self, search_results, website_results, all_website_data):
        """Format response based on website data when chain fails"""
        response = "**Based on our website analysis:**\n\n"
        
        # Add product information if available
        if search_results:
            response += "**Relevant Products:**\n"
            for result in search_results[:5]:
                response += f"**{result['title']}**\n"
                response += f"{result['description'][:300]}...\n"
                response += f"Category: {result['category']}\n\n"
        
        # Add relevant website content
        if website_results:
            response += "**Relevant Information from Website:**\n"
            for result in website_results:
                response += f"From {result['url']}:\n"
                response += f"{result['content']}\n\n"
        
        # Add general website content if no specific results
        if not website_results and all_website_data:
            response += "**General Website Information:**\n"
            for page in all_website_data[:3]:
                response += f"From {page['url']}:\n"
                response += f"{page['content'][:400]}...\n\n"
        
        response += "**Company Information:**\n"
        response += "- **Company Name:** Nucleus Metal Cast Private Limited\n"
        response += "- **GSTIN:** 24AAFCN3454D1ZP\n"
        response += "- **Specialization:** Shell casting, pump manufacturing, and precision industrial components\n\n"
        response += "This information is extracted directly from our website. For more details, please visit our website or contact us directly."
        
        return response
    
    def _format_emergency_response(self, user_query):
        """Emergency response when no website data is available - only as last resort"""
        response = "**Nucleus Metal Cast Private Limited**\n\n"
        response += "I apologize, but I'm currently unable to access our website data. \n\n"
        response += "**Basic Company Information:**\n"
        response += "- **Company Name:** Nucleus Metal Cast Private Limited\n"
        response += "- **GSTIN:** 24AAFCN3454D1ZP\n"
        response += "- **Specialization:** Shell casting, pump manufacturing, and precision industrial components\n\n"
        response += "Please visit our website at https://encoreshellcastllp.com/ for detailed information about our products and services, or try again later when our website analysis is functional."
        
        return response

if __name__ == "__main__":
    agent = SimpleAIAgent()
    print(agent.chat("What products do you manufacture?"))
