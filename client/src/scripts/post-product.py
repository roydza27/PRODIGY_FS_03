import json
import re
import requests

API_URL = "http://localhost:5000/api/products"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTA4YWVjYWU0MWI0OTMxYjgxNjE3MmMiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3OTk0NzU0MywiZXhwIjoxNzgwNTUyMzQzfQ.YlLQakzsoxc1Zd6JuIMCpubs6XAt901F47Dhc60rk1Y"  # optional auth token


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
    try:
        return float(value)
    except (TypeError, ValueError):
        return default

def to_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default

def is_valid_image(url: str) -> bool:
    try:
        resp = requests.get(
            url,
            headers={"User-Agent": "Mozilla/5.0"},
            stream=True,
            timeout=10,
        )
        ok = resp.status_code == 200
        resp.close()
        return ok
    except requests.RequestException:
        return False

def get_all_products():
    resp = requests.get(API_URL, headers=headers, timeout=15)
    resp.raise_for_status()

    payload = resp.json()

    if isinstance(payload, list):
        return payload

    if isinstance(payload, dict):
        for key in ("products", "data", "items", "results"):
            if isinstance(payload.get(key), list):
                return payload[key]

    return []

def find_product_by_slug(slug: str):
    try:
        products = get_all_products()
    except requests.RequestException:
        return None

    for product in products:
        if str(product.get("slug", "")).strip() == slug:
            return product
    return None

with open("product.json", "r", encoding="utf-8") as file:
    raw = json.load(file)

name = raw.get("product_title") or raw.get("short_title") or ""
slug = slugify(name)

all_images = raw.get("image_urls", [])
valid_images = [url for url in all_images if isinstance(url, str) and is_valid_image(url)]

product_data = {
    "name": name,
    "slug": slug,
    "price": to_float(raw.get("current_price", 0)),
    "comparePrice": to_float(raw.get("original_price", 0)),
    "stock": to_int(raw.get("stock", 1)),
    "images": valid_images,
    "description": raw.get("description", ""),
    "category": raw.get("category", "other"),
    "status": raw.get("status", "draft"),
    "featured": raw.get("featured", False),
    "specifications": raw.get("specifications", []),
    "faqs": raw.get("faqs", []),
}

existing_product = find_product_by_slug(slug)

if existing_product:
    product_id = existing_product.get("_id") or existing_product.get("id")
    if not product_id:
        print("❌ Found product with same slug, but no id was returned by API")
        raise SystemExit(1)

    response = requests.patch(
        f"{API_URL}/{product_id}",
        headers=headers,
        json=product_data,
    )
    mode = "updated"
else:
    response = requests.post(
        API_URL,
        headers=headers,
        json=product_data,
    )
    mode = "created"

if response.status_code in (200, 201):
    print(f"✅ Product {mode} successfully")
    print(response.json())
else:
    print(f"❌ Failed to {mode} product")
    print("Status:", response.status_code)
    print(response.text)