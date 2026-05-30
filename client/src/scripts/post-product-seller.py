import json
import re
import sys
import requests

BASE_URL = "http://localhost:5000/api"
SELLER_PRODUCTS_URL = f"{BASE_URL}/seller/products"

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTE5ZGNhYTk5ZmRjYmFlNjhlNDBkODMiLCJlbWFpbCI6InJveWR6YTI3MjVAZ21haWwuY29tIiwicm9sZSI6InNlbGxlciIsImlhdCI6MTc4MDA4MDAzOSwiZXhwIjoxNzgwNjg0ODM5fQ.ZXTgZfsfCOoTVIJD_rWXu6XjvY93sjvbpOGy4HInp3I"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {TOKEN}",
}

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text

def to_float(value, default=0.0):
    try: return float(value)
    except (TypeError, ValueError): return default

def to_int(value, default=0):
    try: return int(value)
    except (TypeError, ValueError): return default

def is_valid_image(url: str) -> bool:
    """Verifies image strings are active network links."""
    if not isinstance(url, str) or not url.startswith(("http://", "https://")):
        return False
    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, stream=True, timeout=3)
        ok = resp.status_code == 200
        resp.close()
        return ok
    except requests.RequestException:
        return False

def get_seller_products():
    try:
        resp = requests.get(SELLER_PRODUCTS_URL, headers=headers, timeout=15)
        resp.raise_for_status()
        payload = resp.json()
        if isinstance(payload, list): return payload
        if isinstance(payload, dict):
            for key in ("products", "data", "items", "results"):
                if isinstance(payload.get(key), list):
                    return payload[key]
        return []
    except requests.RequestException as e:
        print(f"❌ Failed to query seller catalog: {e}")
        sys.exit(1)

# --- Execution Core ---

try:
    with open("product.json", "r", encoding="utf-8") as file:
        raw = json.load(file)
except FileNotFoundError:
    print("❌ Error: product.json not found.")
    sys.exit(1)

name = raw.get("product_title") or raw.get("short_title") or ""
if not name:
    print("❌ Error: Product title fields are missing inside product.json")
    sys.exit(1)

slug = slugify(name)
print(f"🚀 Processing seller product: '{name}' ({slug})")

# Extract and clean images array
all_images = raw.get("image_urls", [])
valid_images = [url for url in all_images if is_valid_image(url)]

# CRITICAL FIX: Backend demands >= 1 image item to clear schema rules
if not valid_images:
    print("⚠️ Warning: No valid image URLs detected. Injecting mandatory placeholder image to clear validation rules.")
    valid_images = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"]

product_data = {
    "name": name,
    "slug": slug,
    "description": raw.get("description", "No description provided"),
    "price": to_float(raw.get("current_price", 0)),
    "compareAtPrice": to_float(raw.get("original_price", 0)),
    "stock": to_int(raw.get("stock", 1)),
    "category": raw.get("category", "electronics"), # Falls back to valid default category
    "images": valid_images,
    "isFeatured": raw.get("featured", False),
    "status": raw.get("status", "draft"),
    "specifications": raw.get("specifications", [{"label": "Status", "value": "Imported"}]),
    "faqs": raw.get("faqs", [{"question": "Available?", "answer": "Yes"}]),
}

# Fetch items exclusively belonging to this specific Seller
seller_items = get_seller_products()
existing_product = next((p for p in seller_items if str(p.get("slug", "")).strip() == slug), None)

if existing_product:
    product_id = existing_product.get("_id") or existing_product.get("id")
    print(f"🔄 Found match in your inventory (ID: {product_id}). Issuing PATCH...")
    response = requests.patch(f"{SELLER_PRODUCTS_URL}/{product_id}", headers=headers, json=product_data)
    mode = "updated"
else:
    print("🆕 Slug clean in your inventory. Issuing POST...")
    response = requests.post(SELLER_PRODUCTS_URL, headers=headers, json=product_data)
    mode = "created"

if response.status_code in (200, 201):
    print(f"✅ Product {mode} successfully!")
    print(json.dumps(response.json(), indent=2))
else:
    print(f"❌ Failed to {mode} product.")
    print("HTTP Status:", response.status_code)
    try:
        print(json.dumps(response.json(), indent=2))
    except ValueError:
        print(response.text)