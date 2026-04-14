import urllib.request
from bs4 import BeautifulSoup
import re
import urllib.parse
import os

base_url = 'https://encoreshellcastllp.com/encoreshellcastllp.com/'
categories = [
    'products/general-engineering.html',
    'products/pump.html',
    'products/railway.html',
    'products/fire%20industry.html',
    'products/power%20plant.html'
]

products = []

for cat in categories:
    url = urllib.parse.urljoin(base_url, cat)
    print(f"Fetching {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read()
        soup = BeautifulSoup(html, 'html.parser')
        # find images
        imgs = soup.find_all('img')
        for img in imgs:
            src = img.get('src')
            if src and "assets/" in src: # assuming images are in assets directory
                full_src = urllib.parse.urljoin(url, src)
                alt = img.get('alt', 'Unknown Product')
                products.append({
                    'category': cat.split('/')[-1].replace('.html', '').replace('%20', ' ').title(),
                    'image': full_src,
                    'name': alt
                })
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")

print(f"Found {len(products)} products.")
for p in products[:10]:
    print(p['name'], p['image'])
