"""
Dynamic product fetching system for Nucleus Metal Cast Private Limited
Scrapes product data from the website in real-time
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import re
from typing import Dict, List, Optional
from crawler import WebsiteCrawler
import time

class DynamicProductFetcher:
    def __init__(self, base_url="https://benevolent-bavarois-0cadab.netlify.app/"):
        self.base_url = base_url
        self.products_cache = {}
        self.last_update = 0
        self.cache_duration = 3600  # 1 hour cache
        
    def fetch_product_page(self, url: str) -> Optional[Dict]:
        """Fetch and parse a product page"""
        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                return None
                
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract product information
            product_data = {
                'url': url,
                'title': self._extract_title(soup),
                'description': self._extract_description(soup),
                'specifications': self._extract_specifications(soup),
                'category': self._extract_category(soup, url),
                'images': self._extract_images(soup, url),
                'price': self._extract_price(soup),
                'availability': self._extract_availability(soup)
            }
            
            return product_data
            
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract product title from page"""
        # Try different selectors for product title
        selectors = [
            'h1',
            '.product-title',
            '.product-name',
            '.title',
            'h2',
            '[class*="title"]',
            '[class*="product"]'
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                title = element.get_text(strip=True)
                if len(title) > 10:  # Avoid short, non-titles
                    return title
        
        return "Unknown Product"
    
    def _extract_description(self, soup: BeautifulSoup) -> str:
        """Extract product description"""
        selectors = [
            '.product-description',
            '.description',
            '.product-details',
            '[class*="description"]',
            'p',
            '.content'
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            for element in elements:
                text = element.get_text(strip=True)
                if len(text) > 50:  # Look for substantial descriptions
                    return text[:500]  # Limit length
        
        return "No description available"
    
    def _extract_specifications(self, soup: BeautifulSoup) -> List[str]:
        """Extract product specifications"""
        specs = []
        
        # Look for specification lists
        spec_selectors = [
            '.specifications li',
            '.specs li',
            '.product-specs li',
            'ul li',
            '.features li'
        ]
        
        for selector in spec_selectors:
            elements = soup.select(selector)
            for element in elements:
                spec = element.get_text(strip=True)
                if len(spec) > 10:
                    specs.append(spec)
        
        return specs[:10]  # Limit to 10 specs
    
    def _extract_category(self, soup: BeautifulSoup, url: str) -> str:
        """Extract product category from URL or page content"""
        # Try to extract from URL
        url_lower = url.lower()
        if 'shell' in url_lower or 'casting' in url_lower:
            return 'shell_castings'
        elif 'pump' in url_lower:
            return 'pumps'
        elif 'precision' in url_lower or 'component' in url_lower:
            return 'precision_components'
        elif 'industrial' in url_lower:
            return 'industrial_castings'
        
        # Try to extract from page content
        category_selectors = [
            '.category',
            '.product-category',
            '[class*="category"]'
        ]
        
        for selector in category_selectors:
            element = soup.select_one(selector)
            if element:
                category = element.get_text(strip=True).lower()
                if 'shell' in category or 'casting' in category:
                    return 'shell_castings'
                elif 'pump' in category:
                    return 'pumps'
                elif 'precision' in category or 'component' in category:
                    return 'precision_components'
                elif 'industrial' in category:
                    return 'industrial_castings'
        
        return 'general'
    
    def _extract_images(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract product images"""
        images = []
        
        # Look for product images
        img_selectors = [
            '.product-image img',
            '.product-photo img',
            '.gallery img',
            'img[alt*="product"]',
            'img[alt*="Product"]'
        ]
        
        for selector in img_selectors:
            elements = soup.select(selector)
            for element in elements:
                src = element.get('src') or element.get('data-src')
                if src:
                    full_url = urljoin(base_url, src)
                    images.append(full_url)
        
        return images[:5]  # Limit to 5 images
    
    def _extract_price(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract product price"""
        price_selectors = [
            '.price',
            '.product-price',
            '[class*="price"]'
        ]
        
        for selector in price_selectors:
            element = soup.select_one(selector)
            if element:
                price_text = element.get_text(strip=True)
                if re.search(r'\$|₹|€|£', price_text):
                    return price_text
        
        return None
    
    def _extract_availability(self, soup: BeautifulSoup) -> str:
        """Extract product availability"""
        availability_selectors = [
            '.availability',
            '.stock',
            '[class*="availability"]',
            '[class*="stock"]'
        ]
        
        for selector in availability_selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text(strip=True)
        
        return "Unknown"
    
    def discover_product_pages(self) -> List[str]:
        """Discover product pages from the website"""
        product_urls = []
        
        try:
            # Use the existing crawler to find pages
            crawler = WebsiteCrawler(self.base_url, max_pages=50)
            crawler.crawl()
            
            # Filter for potential product pages
            for page_data in crawler.get_all_content():
                url = page_data['url']
                content = page_data['content'].lower()
                
                # Check if page contains product-related keywords
                product_keywords = [
                    'pump', 'casting', 'shell', 'precision', 'component',
                    'impeller', 'seal', 'gasket', 'valve', 'housing'
                ]
                
                if any(keyword in content for keyword in product_keywords):
                    product_urls.append(url)
            
            return product_urls[:20]  # Limit to 20 product pages
            
        except Exception as e:
            print(f"Error discovering product pages: {e}")
            return []
    
    def fetch_all_products(self) -> Dict[str, List[Dict]]:
        """Fetch all products from the website"""
        current_time = time.time()
        
        # Check cache
        if (self.products_cache and 
            current_time - self.last_update < self.cache_duration):
            return self.products_cache
        
        print("Fetching fresh product data from website...")
        
        # Discover product pages
        product_urls = self.discover_product_pages()
        
        # Fetch product data
        products_by_category = {
            'shell_castings': [],
            'pumps': [],
            'pump_components': [],
            'precision_components': [],
            'industrial_castings': []
        }
        
        for url in product_urls:
            product_data = self.fetch_product_page(url)
            if product_data:
                category = product_data['category']
                if category in products_by_category:
                    products_by_category[category].append(product_data)
                else:
                    products_by_category['general'] = products_by_category.get('general', [])
                    products_by_category['general'].append(product_data)
        
        # Update cache
        self.products_cache = products_by_category
        self.last_update = current_time
        
        print(f"Fetched {sum(len(products) for products in products_by_category.values())} products")
        return products_by_category
    
    def get_product_names(self) -> Dict[str, List[str]]:
        """Get just the product names organized by category"""
        products_data = self.fetch_all_products()
        product_names = {}
        
        for category, products in products_data.items():
            product_names[category] = [product['title'] for product in products if product['title'] != 'Unknown Product']
        
        return product_names
    
    def search_products(self, query: str) -> List[Dict]:
        """Search products by name or description"""
        products_data = self.fetch_all_products()
        query = query.lower()
        results = []
        
        for category, products in products_data.items():
            for product in products:
                if (query in product['title'].lower() or 
                    query in product['description'].lower()):
                    results.append(product)
        
        return results

if __name__ == "__main__":
    fetcher = DynamicProductFetcher()
    
    # Test fetching products
    products = fetcher.fetch_all_products()
    print("Products by category:")
    for category, product_list in products.items():
        print(f"{category}: {len(product_list)} products")
        for product in product_list[:2]:  # Show first 2
            print(f"  - {product['title']}")
    
    # Test search
    search_results = fetcher.search_products("pump")
    print(f"\nFound {len(search_results)} products matching 'pump'")
