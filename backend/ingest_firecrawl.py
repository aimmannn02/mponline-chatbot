import os
from dotenv import load_dotenv
from firecrawl import FirecrawlApp

# 1. Load environment variables
load_dotenv()

# 2. Initialize Firecrawl
api_key = os.getenv("FIRECRAWL_API_KEY")
app = FirecrawlApp(api_key=api_key)

target_url = "https://www.mponline.gov.in"
print(f"Scraping and processing content from {target_url}...")

try:
    # 3. Scrape the live website page
    response = app.scrape_url(target_url, formats=['markdown'])
    markdown_content = response.get('markdown', '') if isinstance(response, dict) else getattr(response, 'markdown', '')

    # 4. Save the scraped markdown text into a local file for your RAG system to read
    output_filename = "scraped_knowledge.txt"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(markdown_content)

    print(f"Success! Saved scraped text to {output_filename}")

except Exception as e:
    print("Error during ingestion:", e)
    