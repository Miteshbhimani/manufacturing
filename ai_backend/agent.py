import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import tool
from vector_db import VectorDBManager
from langchain import hub

load_dotenv()

# Initialize DB manager
db_manager = VectorDBManager()

@tool
def search_website(query: str):
    """Search the website for information about manufacturing, products, pumps, and other related topics."""
    results = db_manager.search(query, k=5)
    return "\n\n".join([f"Source: {res.metadata['source']}\nContent: {res.page_content}" for res in results])

class AIAgent:
    def __init__(self, model_name="openai/gpt-4o-mini"): # Default to OpenRouter model
        self.llm = ChatOpenAI(
            openai_api_base="https://openrouter.ai/api/v1",
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            model=model_name,
            temperature=0,
        )
        self.tools = [search_website]
        self._setup_agent()

    def _setup_agent(self):
        # We can use a pre-built prompt or define our own
        prompt = hub.pull("hwchase17/openai-functions-agent")
        
        system_msg = """You are a helpful AI chatbot for a manufacturing website (Nucleus Metal Cast Private Limited). 
        You answer user questions accurately using the website content. 
        Always provide answers grounded in the retrieved information. 
        If you don't know the answer, say you don't know and suggest contacting the company.
        Use search_website tool to find relevant information."""
        
        # Modify prompt to include system message if needed, but for openai-functions-agent we can pass it
        self.agent = create_openai_functions_agent(self.llm, self.tools, prompt)
        self.agent_executor = AgentExecutor(agent=self.agent, tools=self.tools, verbose=True)

    def chat(self, user_query, chat_history=None):
        if chat_history is None:
            chat_history = []
        
        response = self.agent_executor.invoke({
            "input": user_query,
            "chat_history": chat_history,
        })
        return response["output"]

if __name__ == "__main__":
    agent = AIAgent()
    print(agent.chat("What products do you manufacture?"))
