import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import PyPDF2
import io
import time

class WebsiteCrawler:
    def __init__(self, base_url, max_pages=100):
        self.base_url = base_url
        self.max_pages = max_pages
        self.visited_urls = set()
        self.content_data = []

    def is_valid_url(self, url):
        parsed = urlparse(url)
        return bool(parsed.netloc) and parsed.netloc == urlparse(self.base_url).netloc

    def extract_text_from_pdf(self, pdf_content):
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            print(f"Error extracting PDF: {e}")
            return ""

    def crawl(self, url=None):
        if url is None:
            url = self.base_url
        
        if len(self.visited_urls) >= self.max_pages or url in self.visited_urls:
            return

        print(f"Crawling: {url}")
        self.visited_urls.add(url)

        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                return

            content_type = response.headers.get('Content-Type', '')

            if 'text/html' in content_type:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Remove noise
                for script_or_style in soup(["script", "style", "nav", "footer", "header"]):
                    script_or_style.decompose()

                text = soup.get_text(separator=' ', strip=True)
                self.content_data.append({"url": url, "content": text})

                # Find more links
                for a_tag in soup.find_all('a', href=True):
                    link = urljoin(url, a_tag['href'])
                    if self.is_valid_url(link) and link not in self.visited_urls:
                        # Avoid anchors and fragments
                        link = link.split('#')[0]
                        path = urlparse(link).path
                        last_part = path.split('/')[-1] if path else ""
                        if link.endswith(('.html', '/', '.php')) or '.' not in last_part:
                             self.crawl(link)
                        elif link.lower().endswith('.pdf'):
                            self.crawl_pdf(link)

            elif 'application/pdf' in content_type:
                self.crawl_pdf(url, response.content)

        except Exception as e:
            print(f"Error crawling {url}: {e}")

    def crawl_pdf(self, url, content=None):
        if url in self.visited_urls and content is None:
            return
        
        print(f"Processing PDF: {url}")
        self.visited_urls.add(url)
        
        try:
            if content is None:
                response = requests.get(url, timeout=10)
                content = response.content
            
            text = self.extract_text_from_pdf(content)
            if text:
                self.content_data.append({"url": url, "content": text})
        except Exception as e:
            print(f"Error processing PDF {url}: {e}")

    def get_all_content(self):
        return self.content_data

if __name__ == "__main__":
    crawler = WebsiteCrawler("https://encoreshellcastllp.com/")
    crawler.crawl()
    print(f"Total pages crawled: {len(crawler.get_all_content())}")
