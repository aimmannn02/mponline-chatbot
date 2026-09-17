import os
from dotenv import load_dotenv
from firecrawl import FirecrawlApp

# 1. Force load the .env file explicitly from the current directory
load_dotenv()

# 2. Grab the API key and check if it's loaded
api_key = os.getenv("FIRECRAWL_API_KEY")
print(f"Loaded API Key: {api_key[:10]}..." if api_key else "API Key is missing!")

# 3. Initialize Firecrawl App
app = FirecrawlApp(api_key=api_key)

# 4. Target URL to scrape
target_url = "https://www.mponline.gov.in"

print(f"Scraping content from {target_url}...")

# 5. Scrape URL correctly (passing formats directly)
try:
    response = app.scrape_url(target_url, formats=['markdown'])
    print("\n--- SCRAPED CONTENT SUCCESSFUL ---")
    
    # Handle response depending on whether it's a dictionary or object
    markdown_content = response.get('markdown', '') if isinstance(response, dict) else getattr(response, 'markdown', '')
    
    print(markdown_content[:400])
except Exception as e:
    print("An error occurred during scraping:", e)