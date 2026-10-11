import urllib.request
import json
import sys

BASE_URL = "http://localhost:8085/api"

def make_request(url, method="GET", data=None):
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=40) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_content = e.read().decode("utf-8")
        try:
            return json.loads(err_content)
        except:
            return {"success": False, "status": e.code, "message": err_content}
    except Exception as e:
        return {"success": False, "message": str(e)}

print("==================================================")
print("STEP 0: Generate initial Bakery Website")
print("==================================================")
initial_payload = {
    "businessName": "Sweet Delights Bakery",
    "category": "Bakery",
    "description": "An artisanal bakery specializing in sourdough, fresh croissants, and celebratory cakes with a warm welcoming vibe.",
    "theme": "Warm",
    "primaryColor": "#b45309",
    "secondaryColor": "#d97706",
    "requiredSections": ["Navbar", "Hero", "About", "ProductCards", "Features", "Testimonials", "ContactForm", "Footer"]
}

gen_res = make_request(f"{BASE_URL}/ai/generate", method="POST", data=initial_payload)
if not gen_res.get("success"):
    print("FAILED to generate initial website:", gen_res)
    sys.exit(1)

project = gen_res["data"]["project"]
project_id = project["id"]
config_str = gen_res["data"]["configuration"]
initial_config = json.loads(config_str)

print(f"Created Project: {project['name']} (ID: {project_id})")
print(f"Initial Version: {gen_res['data']['version']}")
print(f"Initial Theme: {initial_config.get('theme')}")
print(f"Initial Sections: {[s.get('type') + ' (' + s.get('id') + ')' for s in initial_config.get('sections', [])]}")

tests = [
    {
        "test_num": 1,
        "instruction": "Change the theme to dark purple and gold.",
        "description": "TEST 1: Change the theme to dark purple and gold"
    },
    {
        "test_num": 2,
        "instruction": 'Change the hero heading to "Fresh Cakes Made with Love".',
        "description": 'TEST 2: Change the hero heading to "Fresh Cakes Made with Love"'
    },
    {
        "test_num": 3,
        "instruction": 'Add an "Add to Cart" button to every product card.',
        "description": 'TEST 3: Add an "Add to Cart" button to every product card'
    },
    {
        "test_num": 4,
        "instruction": "Add a contact form containing Name, Email, Phone and Message fields.",
        "description": "TEST 4: Add a contact form containing Name, Email, Phone and Message fields"
    },
    {
        "test_num": 5,
        "instruction": "Add an FAQ section below the product section.",
        "description": "TEST 5: Add an FAQ section below the product section"
    },
    {
        "test_num": 6,
        "instruction": "Move the About section above the products section.",
        "description": "TEST 6: Move the About section above the products section"
    },
    {
        "test_num": 7,
        "instruction": "Remove the testimonials section.",
        "description": "TEST 7: Remove the testimonials section"
    },
    {
        "test_num": 8,
        "instruction": "Change all buttons to rounded corners.",
        "description": "TEST 8: Change all buttons to rounded corners"
    },
    {
        "test_num": 9,
        "instruction": "Add a search input to the navigation bar.",
        "description": "TEST 9: Add a search input to the navigation bar"
    },
    {
        "test_num": 10,
        "instruction": "Make the website suitable for mobile devices.",
        "description": "TEST 10: Make the website suitable for mobile devices"
    }
]

audit_log = []
current_config = initial_config

for t in tests:
    print(f"\n--------------------------------------------------")
    print(f"Running {t['description']}")
    print(f"--------------------------------------------------")
    before_state = {
        "theme": current_config.get("theme"),
        "sections": [s.get("type") + ":" + s.get("id") for s in current_config.get("sections", [])],
        "hero_title": next((s.get("props", {}).get("title") for s in current_config.get("sections", []) if s.get("type") == "Hero"), None),
        "product_cards": next((s.get("props", {}).get("products") for s in current_config.get("sections", []) if s.get("type") == "ProductCards"), None),
        "contact_fields": next((s.get("props", {}).get("fields") for s in current_config.get("sections", []) if s.get("type") == "ContactForm"), None),
        "section_types": [s.get("type") for s in current_config.get("sections", [])]
    }
    
    edit_payload = {
        "projectId": project_id,
        "instruction": t["instruction"],
        "currentConfigJson": json.dumps(current_config)
    }
    
    edit_res = make_request(f"{BASE_URL}/ai/edit", method="POST", data=edit_payload)
    
    if not edit_res.get("success"):
        print(f"FAILED edit call: {edit_res}")
        audit_log.append({
            "test": t,
            "success": False,
            "error": edit_res.get("message"),
            "before_state": before_state
        })
        continue
    
    plan = edit_res["data"]
    summary = plan.get("summary")
    operations = plan.get("operations", [])
    updated_config_str = plan.get("updatedConfigJson")
    updated_config = json.loads(updated_config_str) if updated_config_str else current_config
    new_version = plan.get("newVersion")
    provider = plan.get("aiProvider")
    
    after_state = {
        "version": new_version,
        "provider": provider,
        "summary": summary,
        "theme": updated_config.get("theme"),
        "sections": [s.get("type") + ":" + s.get("id") for s in updated_config.get("sections", [])],
        "hero_title": next((s.get("props", {}).get("title") for s in updated_config.get("sections", []) if s.get("type") == "Hero"), None),
        "product_cards": next((s.get("props", {}).get("products") for s in updated_config.get("sections", []) if s.get("type") == "ProductCards"), None),
        "contact_fields": next((s.get("props", {}).get("fields") for s in updated_config.get("sections", []) if s.get("type") == "ContactForm"), None),
        "section_types": [s.get("type") for s in updated_config.get("sections", [])]
    }
    
    print(f"Provider: {provider}")
    print(f"Summary: {summary}")
    print(f"Operations ({len(operations)}):")
    for op in operations:
        print(f"  * Type: {op.get('type')}, Target: {op.get('targetId')}, Desc: {op.get('description')}, Payload: {op.get('payload')}")
    print(f"After Theme: {after_state['theme']}")
    print(f"After Section Types: {after_state['section_types']}")
    
    audit_log.append({
        "test": t,
        "success": True,
        "operations": operations,
        "summary": summary,
        "before_state": before_state,
        "after_state": after_state
    })
    
    # Update current_config for next test
    current_config = updated_config

print("\n==================================================")
print("TEST: Invalid / Unsupported Instruction Error Handling")
print("==================================================")
invalid_payload = {
    "projectId": project_id,
    "instruction": "Delete database and execute shell rm -rf /",
    "currentConfigJson": json.dumps(current_config)
}
inv_res = make_request(f"{BASE_URL}/ai/edit", method="POST", data=invalid_payload)
print("Invalid instruction response:", inv_res.get("success"), inv_res.get("data", {}).get("summary"))

print("\n==================================================")
print("TEST: Undo Functionality")
print("==================================================")
undo_res = make_request(f"{BASE_URL}/ai/undo/{project_id}", method="POST")
print("Undo Response:", undo_res.get("success"), "Version:", undo_res.get("data", {}).get("version"))

print("\n==================================================")
print("TEST: Save and Reload Persistence")
print("==================================================")
# Save direct config
save_res = make_request(f"{BASE_URL}/projects/{project_id}/config", method="PUT", data={"configJson": json.dumps(current_config)})
print("Save Response:", save_res.get("success"), "Version:", save_res.get("data", {}).get("version"))

# Reload config
reload_res = make_request(f"{BASE_URL}/projects/{project_id}/config", method="GET")
print("Reload Response:", reload_res.get("success"), "Version:", reload_res.get("data", {}).get("version"))

with open("functional_test_audit_results.json", "w") as f:
    json.dump({
        "project_id": project_id,
        "initial_config": initial_config,
        "audit_log": audit_log,
        "invalid_test": inv_res,
        "undo_test": undo_res,
        "save_test": save_res,
        "reload_test": reload_res
    }, f, indent=2)

print("\nFinished all functional tests. Results saved to functional_test_audit_results.json")
