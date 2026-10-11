-- ==============================================================================
-- SaaSsum AI Commerce - Sample Seed Data
-- ==============================================================================

INSERT INTO projects (id, name, description, business_name, category)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'VoiceFlow Commerce Engine',
    'AI voice bot platform for next-generation automated customer service and retail.',
    'VoiceFlow AI',
    'SaaS & Tech'
) ON CONFLICT DO NOTHING;

INSERT INTO website_configurations (project_id, version, config_data)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    1,
    '{
      "theme": {
        "id": "Modern",
        "primaryColor": "#6366f1",
        "secondaryColor": "#a855f7",
        "backgroundColor": "#0b0f19",
        "textColor": "#f9fafb",
        "cardBackground": "#111827",
        "fontFamily": "Inter, sans-serif",
        "borderRadius": "12px",
        "isDark": true
      },
      "meta": {
        "title": "VoiceFlow AI | Autonomous Customer Care",
        "tagline": "Transform tier-1 support with human-like voice AI bots.",
        "brandName": "VoiceFlow AI"
      },
      "sections": [
        {
          "id": "sec-navbar-1",
          "type": "Navbar",
          "props": {
            "brandName": "VoiceFlow AI",
            "links": [
              {"text": "Features", "href": "#features"},
              {"text": "Solutions", "href": "#services"},
              {"text": "Pricing", "href": "#pricing"},
              {"text": "FAQ", "href": "#faq"}
            ],
            "ctaText": "Start Free Trial",
            "ctaHref": "#pricing"
          }
        },
        {
          "id": "sec-hero-1",
          "type": "Hero",
          "props": {
            "badge": "⚡ Autonomous Voice 2.0 • Live",
            "title": "Transform Customer Support With Voice AI",
            "subtitle": "VoiceFlow AI answers calls with sub-second latency, human-like empathy, and instant CRM ticket resolution.",
            "primaryCta": "Start 14-Day Free Trial",
            "primaryCtaHref": "#pricing",
            "secondaryCta": "Hear Live Demo",
            "secondaryCtaHref": "#services"
          }
        },
        {
          "id": "sec-services-1",
          "type": "ServiceCards",
          "props": {
            "title": "Enterprise Voice Intelligence",
            "subtitle": "Built for high-volume support, outbound sales, and omnichannel engagement.",
            "services": [
              {"icon": "⚡", "title": "Sub-Second Latency", "description": "Conversational pacing under 250ms feels completely natural and responsive."},
              {"icon": "🌐", "title": "40+ Global Accents", "description": "Native accent recognition across English, Spanish, German, French and Japanese."},
              {"icon": "🔗", "title": "Instant CRM Sync", "description": "1-click integrations into Zendesk, Salesforce, HubSpot, and custom REST webhooks."}
            ]
          }
        },
        {
          "id": "sec-pricing-1",
          "type": "PricingCards",
          "props": {
            "title": "Predictable, Scalable Pricing",
            "subtitle": "Zero setup fees. Pay only for what your team uses.",
            "plans": [
              {
                "name": "Starter",
                "price": "$49",
                "period": "/month",
                "description": "Perfect for growing stores testing automated phone care.",
                "features": ["1,000 voice minutes", "Standard accents", "Email support", "Basic analytics"],
                "popular": false,
                "ctaText": "Choose Starter"
              },
              {
                "name": "Growth Pro",
                "price": "$149",
                "period": "/month",
                "description": "High-volume call centers and scaling DTC brands.",
                "features": ["5,000 voice minutes", "Custom cloned voices", "CRM two-way sync", "Priority 24/7 support"],
                "popular": true,
                "ctaText": "Get Growth Pro"
              }
            ]
          }
        },
        {
          "id": "sec-faq-1",
          "type": "FAQ",
          "props": {
            "title": "Frequently Asked Questions",
            "items": [
              {"question": "How difficult is setup?", "answer": "Most teams are live with custom prompt workflows in under 15 minutes."},
              {"question": "Can VoiceFlow transfer to human agents?", "answer": "Yes, seamless warm or cold SIP transfer to any human phone line or softphone."}
            ]
          }
        },
        {
          "id": "sec-footer-1",
          "type": "Footer",
          "props": {
            "brandName": "VoiceFlow AI",
            "copyright": "© 2026 VoiceFlow AI. All rights reserved.",
            "links": ["Privacy Policy", "Terms of Service", "Documentation", "Contact"]
          }
        }
      ]
    }'::jsonb
) ON CONFLICT (project_id) DO NOTHING;

INSERT INTO website_versions (project_id, version_number, change_summary, operation_type, config_snapshot)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    1,
    'Initial generation for VoiceFlow AI',
    'INITIAL_GENERATION',
    (SELECT config_data FROM website_configurations WHERE project_id = 'a0000000-0000-0000-0000-000000000001')
) ON CONFLICT DO NOTHING;
