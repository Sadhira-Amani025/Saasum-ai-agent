import urllib.request
import json
import sys

BASE_URL = "http://localhost:8085/api"

test_cases = [
    {
        "id": 1,
        "name": "Bakery",
        "payload": {
            "businessName": "Golden Crust Bakery",
            "category": "Bakery",
            "description": "Artisan bakery featuring handmade cakes, freshly baked breads, pastries, and treats with cream and brown warm aesthetic. About section with our craft and full contact details.",
            "theme": "Warm",
            "primaryColor": "#5c3a21",  # Brown
            "secondaryColor": "#d4a373", # Cream/Tan
            "productDetails": "Custom Velvet Cake ($45), Triple Chocolate Fudge Cake ($38), Almond Honey Pastry ($6)",
            "contactDetails": "124 Pastry Lane, Open Daily 7am - 6pm, Call (555) 234-5678",
            "requiredSections": ["Navbar", "Hero", "About", "ProductCards", "Features", "Gallery", "ContactForm", "Footer"]
        }
    },
    {
        "id": 2,
        "name": "Electronics store",
        "payload": {
            "businessName": "ElectroPulse Tech",
            "category": "Online Store",
            "description": "Modern electronics retail store with blue and white theme, cutting-edge audio gear, displays, accessories, search box, prices and detailed specifications.",
            "theme": "Modern",
            "primaryColor": "#2563eb",  # Blue
            "secondaryColor": "#38bdf8", # Light Blue
            "productDetails": "Noise Cancelling Headphones ($299), Ultra HD 4K Monitor ($450), Mechanical Gaming Keyboard ($120)",
            "contactDetails": "support@electropulse.io, 1-800-ELECTRO",
            "requiredSections": ["Navbar", "Hero", "SearchInput", "ProductCards", "About", "Features", "ContactForm", "Footer"]
        }
    },
    {
        "id": 3,
        "name": "Portfolio",
        "payload": {
            "businessName": "Alex Rivers Portfolio",
            "category": "Portfolio",
            "description": "Minimalist creative portfolio for senior UI/UX designer and software architect. Includes profile introduction, skills, selected projects, resume download link and contact form.",
            "theme": "Minimal",
            "primaryColor": "#0f172a",
            "secondaryColor": "#64748b",
            "requiredSections": ["Navbar", "Hero", "About", "ServiceCards", "Gallery", "ContactForm", "Footer"]
        }
    },
    {
        "id": 4,
        "name": "Restaurant",
        "payload": {
            "businessName": "L'Osteria Bella",
            "category": "Restaurant",
            "description": "Authentic wood-fired Italian restaurant. Attractive hero banner, seasonal tasting menu with prices, opening hours, downtown location and online reservation inquiry form.",
            "theme": "Elegant",
            "primaryColor": "#b91c1c",
            "secondaryColor": "#d97706",
            "contactDetails": "742 Bellissimo Way, Downtown. Tue-Sun 5:00 PM - 11:00 PM. Reservations: (555) 888-9999",
            "requiredSections": ["Navbar", "Hero", "About", "ProductCards", "Features", "Gallery", "ContactForm", "Footer"]
        }
    },
    {
        "id": 5,
        "name": "Digital agency",
        "payload": {
            "businessName": "Apex Growth Studio",
            "category": "Digital Agency",
            "description": "Full-service digital engineering and growth agency. Hero section, services, client case study portfolio, fixed-price sprint pricing packages and discovery lead generation form.",
            "theme": "Modern",
            "primaryColor": "#6366f1",
            "secondaryColor": "#06b6d4",
            "requiredSections": ["Navbar", "Hero", "ServiceCards", "Gallery", "PricingCards", "Testimonials", "ContactForm", "Footer"]
        }
    }
]

results = []

for tc in test_cases:
    print(f"\n=======================================================")
    print(f"Executing Test Case {tc['id']}: {tc['name']}")
    print(f"=======================================================")
    req_data = json.dumps(tc["payload"]).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/ai/generate",
        data=req_data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if not data.get("success"):
                print(f"[ERROR] API returned failure: {data.get('message')}")
                results.append({"tc": tc, "success": False, "error": data.get("message")})
                continue
            
            project = data["data"]["project"]
            config_str = data["data"]["configuration"]
            config = json.loads(config_str)
            
            print(f"Project ID: {project.get('id')}")
            print(f"Theme: {config.get('theme')}")
            
            sections = config.get("sections", [])
            sec_types = [s.get("type") for s in sections]
            print(f"Generated Sections count: {len(sections)}")
            print(f"Section types: {sec_types}")
            
            # Check export
            project_id = project.get("id")
            export_req = urllib.request.Request(f"{BASE_URL}/export/project/{project_id}")
            with urllib.request.urlopen(export_req, timeout=10) as exp_resp:
                zip_bytes = exp_resp.read()
                print(f"Export ZIP size: {len(zip_bytes)} bytes")
                
            results.append({
                "tc": tc,
                "success": True,
                "project": project,
                "config": config,
                "sec_types": sec_types,
                "zip_size": len(zip_bytes)
            })
            
    except Exception as e:
        print(f"[EXCEPTION] {e}")
        results.append({"tc": tc, "success": False, "error": str(e)})

with open("test_results.json", "w") as f:
    json.dump(results, f, indent=2)

print("\n\nAll 5 test cases executed. Summary written to test_results.json")
