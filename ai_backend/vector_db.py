import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

class VectorDBManager:
    def __init__(self, persist_directory="./chroma_db"):
        self.persist_directory = persist_directory
        self.embeddings = OpenAIEmbeddings(
            openai_api_base="https://openrouter.ai/api/v1",
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            model="text-embedding-3-small"
        )
        self.vector_store = None
        self._initialize_db()

    def _initialize_db(self):
        if os.path.exists(self.persist_directory):
            self.vector_store = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings
            )
        else:
            # Create a dummy doc to initialize
            self.vector_store = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings
            )

    def add_content(self, content_list):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=100,
            length_function=len,
        )

        documents = []
        for item in content_list:
            chunks = text_splitter.split_text(item['content'])
            for chunk in chunks:
                documents.append(Document(
                    page_content=chunk,
                    metadata={"source": item['url']}
                ))
        
        if documents:
            self.vector_store.add_documents(documents)
            print(f"Added {len(documents)} document chunks to vector DB.")

    def search(self, query, k=5):
        if not self.vector_store:
            return []
        return self.vector_store.similarity_search(query, k=k)

    def clear_db(self):
        if self.vector_store:
            # Chroma doesn't have a direct clear_all for the current version easily exposed
            # but we can re-initialize or delete the directory
            import shutil
            shutil.rmtree(self.persist_directory)
            self._initialize_db()

if __name__ == "__main__":
    db = VectorDBManager()
    db.add_content([{"url": "test", "content": "This is a test content about manufacturing pumps."}])
    results = db.search("pumps")
    for res in results:
        print(res.page_content)
