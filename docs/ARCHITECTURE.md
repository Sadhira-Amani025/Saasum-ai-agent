# 🏛️ SaaSsum AI Commerce - System Architecture

## 1. System Overview

SaaSsum AI Commerce is an enterprise-grade AI-powered website builder that transforms natural-language business descriptions into full digital commerce websites and permits fine-grained, conversational modifications.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          REACT FRONTEND (:5173)                        │
│   • Dashboard Wizard (Initial Generation)                              │
│   • Split-Screen Live Preview (Desktop / Tablet / Mobile)             │
│   • Conversational AI Assistant & Version History Timeline            │
│   • Reusable Component Renderer (Navbar, Hero, Cards, Forms, FAQ...)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SPRING BOOT 3 BACKEND (:8085)                       │
│   • RestControllers (/api/projects, /api/ai/generate, /api/ai/edit)    │
│   • WebsiteModifierEngine (Deterministic patch / operation executor)   │
│   • Gemini / OpenAI AI Providers (Structured JSON generation)         │
│   • Version Manager (Undo, Redo, Snapshot History)                     │
│   • Export Engine (Standalone HTML / CSS / JS ZIP Builder)             │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
       ┌────────────────────────┐      ┌─────────────────────────┐
       │   SUPABASE POSTGRESQL  │      │   LLM API (GEMINI / OAI)│
       │   (Projects & JSONB)   │      │   (Structured JSON Only)│
       └────────────────────────┘      └─────────────────────────┘
```

---

## 2. Reusable Component Model

Websites are represented in memory and in PostgreSQL as a validated JSON document containing:
- `theme`: Colors, fonts, radius, background, dark/light mode.
- `meta`: Brand name, SEO title, tagline.
- `sections`: An ordered list of structured components:
  - `Navbar`
  - `Hero`
  - `TextSection`
  - `ImageSection`
  - `ProductCards`
  - `ServiceCards`
  - `ContactForm`
  - `SearchInput`
  - `Newsletter`
  - `Testimonials`
  - `FAQ`
  - `PricingCards`
  - `Footer`

---

## 3. Supported Structured Operations

When users give conversational instructions (e.g. *"Change theme to dark purple and gold"*, *"Add a search bar"*, *"Move testimonials above pricing"*), the Spring Boot backend instructs the LLM to output a **Change Plan** containing explicit, validated operation types:

| Operation Type | Description | Target / Payload |
|---|---|---|
| `UPDATE_THEME` | Updates primary, secondary, bg color, font, or radius | `{ primaryColor, isDark, ... }` |
| `UPDATE_TEXT` | Edits text, headings, badges, or subheadlines | `sectionId` or `fieldPath`, `text` |
| `ADD_SECTION` | Inserts a new component (Hero, FAQ, Products, etc.) | `sectionType`, `props`, `position` |
| `REMOVE_SECTION` | Deletes a specified section | `sectionId` or `sectionType` |
| `REORDER_SECTION` | Moves a section up, down, or to a specific index | `sectionId`, `newIndex` |
| `ADD_BUTTON` | Injects an action button (Buy Now, WhatsApp, Contact) | `sectionId`, `buttonProps` |
| `UPDATE_BUTTON` | Alters existing button text, color, or target URL | `sectionId`, `buttonIndex`, `newProps` |
| `ADD_FORM_FIELD` | Adds email, phone, name, or password input to form | `sectionId`, `fieldProps` |
| `REMOVE_COMPONENT` | Removes a sub-item (e.g. product card or form field) | `sectionId`, `targetItemIndex` |
| `UPDATE_LAYOUT` | Adjusts padding, alignment, container width | `sectionId`, `layoutConfig` |
| `ADD_PRODUCT` | Appends a product or service card | `sectionId`, `productProps` |
| `UPDATE_COMPONENT_STYLE` | Customizes styling tokens on a specific section | `sectionId`, `styleProps` |

The **`WebsiteModifierEngine`** in Spring Boot validates every operation and deterministically applies changes to the existing JSON configuration while **strictly preserving all unrelated sections**.

---

## 4. Security Principles

1. **Zero Arbitrary Code Execution**: The LLM NEVER generates JavaScript code that runs on the server or browser. It outputs only JSON specifications.
2. **Key Isolation**: Gemini / OpenAI keys and database credentials reside strictly on the Spring Boot backend and are never sent to the client.
3. **Immutability & Rollback**: Every accepted change creates a record in `website_versions` in PostgreSQL, enabling 1-click Undo and Restore.
