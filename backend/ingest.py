import os
import json
from pypdf import PdfReader
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

with open("scraped_knowledge.txt", "r", encoding="utf-8") as f:
    full_text = f.read()

print(f"Extracted {len(full_text)} characters from the PDF.")

def split_into_chunks(text, chunk_size=800):
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunk = text[i:i + chunk_size].strip()
        if chunk:
            chunks.append(chunk)
    return chunks

chunks = split_into_chunks(full_text)
print(f"Split into {len(chunks)} chunks.")

data = []
for i, chunk in enumerate(chunks):
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=chunk
    )
    embedding = result.embeddings[0].values
    data.append({"text": chunk, "embedding": embedding})
    print(f"Processed chunk {i + 1}/{len(chunks)}")

with open("embeddings.json", "w") as f:
    json.dump(data, f)

print("Done! Saved to embeddings.json")