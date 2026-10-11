import json

with open("test_results.json", "r") as f:
    results = json.load(f)

for r in results:
    tc = r["tc"]
    config = r["config"]
    theme = config.get("theme", {})
    sections = config.get("sections", [])
    
    print("=" * 60)
    print(f"CASE {tc['id']}: {tc['name']}")
    print(f"Theme Details: id={theme.get('id')}, primary={theme.get('primaryColor')}, secondary={theme.get('secondaryColor')}, bg={theme.get('backgroundColor')}, text={theme.get('textColor')}, cardBg={theme.get('cardBackground')}, isDark={theme.get('isDark')}")
    print(f"Sections Count: {len(sections)}")
    for i, s in enumerate(sections):
        stype = s.get("type")
        sid = s.get("id")
        props = s.get("props", {})
        title = props.get("title", props.get("brandName", ""))
        print(f"  [{i}] {stype} (id: {sid}) - title: {title}")
        if stype == "ProductCards":
            products = props.get("products", [])
            print(f"      Products ({len(products)}):")
            for p in products:
                print(f"        * {p.get('name')} | {p.get('price')} | {p.get('description')[:50]}...")
        elif stype == "ServiceCards":
            services = props.get("services", [])
            print(f"      Services ({len(services)}):")
            for sv in services:
                print(f"        * {sv.get('title')} | {sv.get('description')[:50]}...")
        elif stype == "ContactForm":
            fields = props.get("fields", [])
            field_names = [f.get("name") or f.get("label") for f in fields]
            print(f"      Contact subtitle/info: {props.get('subtitle')}")
            print(f"      Fields: {field_names}")
        elif stype == "SearchInput":
            print(f"      Placeholder: {props.get('placeholder')}, buttonText: {props.get('buttonText')}")
        elif stype == "PricingCards":
            plans = props.get("plans", [])
            print(f"      Plans ({len(plans)}): {[p.get('name') + ' ' + p.get('price') for p in plans]}")
        elif stype == "Hero":
            print(f"      Hero CTA: primary='{props.get('primaryCta')}', secondary='{props.get('secondaryCta')}'")
        elif stype == "Footer":
            print(f"      Footer links: {props.get('links')}")

