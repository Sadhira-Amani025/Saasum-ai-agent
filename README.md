# 🚀 SaaSsum AI Commerce — From Business Idea to Digital Business in Minutes

> **Hackathon MVP**: Describe your business in natural language, generate a live responsive digital commerce website, conversationally modify layouts, styles, and components using structured AI operations, track version history with 1-click restore/undo, and export ready-to-deploy standalone website packages.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 17 LTS, Spring Boot 3.3.4, Maven, Spring Web, Spring Data JPA, Spring Validation |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Component-based architecture |
| **Database** | Supabase PostgreSQL (Production) + In-Memory H2 (Zero-Setup Demo Fallback) |
| **AI Integration** | Google Gemini API (gemini-3.5-flash / gemini-3.5-flash-lite) & OpenAI REST client |
| **Packaging & Export** | In-Memory ZIP generation (`index.html`, `style.css`, `script.js`, `README.md`) |

---

## 📁 Repository Structure

```
d:\AI agent/
├── backend/                                   # Spring Boot 3 Java Backend (:8085)
│   ├── src/main/java/com/saassum/ai/
│   │   ├── config/                            # CORS & AI configuration
│   │   ├── controller/                        # REST API endpoints (/api/projects, /api/ai, /api/export)
│   │   ├── dto/                               # Structured payloads (InitialGeneration, ChangeOperation, etc.)
│   │   ├── model/                             # JPA Entities (Project, WebsiteConfiguration, WebsiteVersion)
│   │   ├── repository/                        # Spring Data JPA Repositories
│   │   └── service/                           # ModifierEngine, GeminiAiService, DemoService, ExportService
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
├── frontend/                                  # React 18 + Vite Frontend (:5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── website/                       # Reusable components (Navbar, Hero, Cards, Forms, FAQ...)
│   │   │   ├── Dashboard.jsx                  # Generation wizard & template presets
│   │   │   ├── EditorLayout.jsx               # Split-screen live preview & Conversational AI editor
│   │   │   └── WebsiteRenderer.jsx            # Sandboxed JSON-to-React component engine
│   │   ├── services/api.js                    # Fetch client communicating with backend
│   │   ├── App.jsx
│   │   └── index.css                          # Design tokens & typography
│   ├── package.json
│   └── vite.config.js                         # Reverse proxy to Spring Boot (:8085)
│
├── database/                                  # Database schema & migrations
│   ├── schema.sql                             # Supabase PostgreSQL schema with RLS & JSONB
│   └── seed.sql                               # Sample starter projects
│
└── docs/                                      # Detailed documentation
    ├── ARCHITECTURE.md                        # Architecture & structured operation protocol
    ├── RUN_GUIDE.md                           # Windows execution instructions
    └── SUPABASE_SETUP.md                      # Supabase PostgreSQL setup & connection guide
```

---

## ⚡ Quick Start Guide (Windows)

### 1. Run the Spring Boot 3 Backend
Open a terminal in `backend/`:
```powershell
cd backend
mvn spring-boot:run
```
Backend runs on 👉 **`http://localhost:8085`**

### 2. Run the React Frontend
Open a second terminal in `frontend/`:
```powershell
cd frontend
npm install
npm run dev
```
Open your browser at 👉 **`http://localhost:5173`**

---

## 💡 Core Features Tested & Verified

1. **AI Business Wizard**: 1-click templates for SaaS, Artisan Coffee, and Minimalist Fashion.
2. **Deterministic Modification Engine**: Natural-language instructions produce validated `ChangeOperation` plans (`UPDATE_THEME`, `ADD_SECTION`, `UPDATE_TEXT`, etc.) while strictly preserving unrelated sections.
3. **Responsive Preview**: Switch between Desktop (100%), Tablet (768px), and Mobile (375px) in real time.
4. **PostgreSQL Version History**: Every revision stores an immutable snapshot supporting 1-click Undo and point-in-time Restore.
5. **Standalone Export**: Download a standalone ZIP containing HTML, CSS, and JS ready for Netlify, Vercel, or GitHub Pages.
