# 🚀 SaaSsum AI Commerce - Execution & Run Guide (Windows)

This document provides exact, tested step-by-step instructions to run both the **Spring Boot 3 Backend** and the **React Vite Frontend** on Windows.

---

## 🛠️ Prerequisites
- **Java 17 LTS** (OpenJDK / Eclipse Temurin 17 installed and on PATH)
- **Apache Maven 3.9+** (installed and on PATH)
- **Node.js v18+ / v20+ / v24+** (installed and on PATH)

---

## 1. Quick Start with 2 Commands

Open two separate Windows PowerShell or CMD terminal windows:

### Terminal 1: Start the Spring Boot Backend (Port 8085)
```powershell
cd "d:\AI agent\backend"

# Optional: set your Gemini API key (or leave empty for Demo Mode)
$env:GEMINI_API_KEY="your_gemini_api_key_here"
$env:GEMINI_MODEL="gemini-3.5-flash"

# Optional: set Supabase PostgreSQL URL (or leave empty for embedded H2)
# $env:SPRING_DATASOURCE_URL="jdbc:postgresql://aws-0-region.pooler.supabase.com:5432/postgres?sslmode=require"
# $env:SPRING_DATASOURCE_USERNAME="postgres.your-ref"
# $env:SPRING_DATASOURCE_PASSWORD="your-password"

mvn spring-boot:run
```

Once started, the backend is running at:
👉 **`http://localhost:8085`**
- Health Probe: `http://localhost:8085/api/health`
- Status & Capabilities: `http://localhost:8085/api/status`
- H2 Console: `http://localhost:8085/h2-console`

---

### Terminal 2: Start the React Frontend (Port 5173)
```powershell
cd "d:\AI agent\frontend"
npm install
npm run dev
```

Once started, open your web browser at:
👉 **`http://localhost:5173`**

---

## 2. Testing the Application End-to-End

1. **Dashboard Wizard**:
   - Choose one of the quick 1-click preset templates (e.g., *VoiceFlow AI*, *Velvet Roast Coffee*, or *KURA Studio Minimal Fashion*) or enter your own business name and description.
   - Click **Generate Website Now**.
2. **Split-Screen Live Preview**:
   - The initial website is generated and rendered immediately on the right side using reusable React components.
   - Switch between **Desktop**, **Tablet (768px)**, and **Mobile (375px)** device views using the header controls.
3. **Conversational AI Modification**:
   - In the left conversational AI panel, type any instruction, for example:
     - *"Change the theme to dark purple and gold."*
     - *"Add a product search bar below hero."*
     - *"Add phone and address fields to the contact form."*
     - *"Move testimonials section above pricing."*
     - *"Make all cards smoothly rounded."*
     - *"Add an FAQ section."*
   - Watch the backend plan the changes, apply the structured operations, and update the live preview without losing any unrelated content.
4. **Undo & Version History**:
   - Click **Undo** to roll back to the previous version snapshot.
   - Switch to the **Version History** tab to view immutable snapshots recorded in PostgreSQL and restore any historical version with 1 click.
5. **Standalone Export**:
   - Click **Export ZIP** in the top bar to download `saassum-website.zip`.
   - Unzip and double-click `index.html` to run the website completely standalone without needing React or Spring Boot!

## 3. Deploying the Node API to Render

The Node API used by the current `server/` application is configured in `render.yaml`.
Create or update the Render web service from the repository's `main` branch and use:

```text
Build Command: npm install --prefix server --omit=dev
Start Command: npm --prefix server start
Health Check Path: /api/health
```

After deployment, confirm the log checks out the latest `main` commit and verify
`https://<your-render-service>.onrender.com/api/health` returns a JSON response with
`"status":"ok"`. Do not use the obsolete `cd server && npm start` command.
