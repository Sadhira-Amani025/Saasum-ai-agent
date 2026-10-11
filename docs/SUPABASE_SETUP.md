# 🐘 Supabase PostgreSQL Setup Guide

SaaSsum AI Commerce supports **Supabase PostgreSQL** for storing projects, website configurations (JSONB), and version history snapshots for undo/redo.

---

## 1. Create a Free Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Choose an organization, enter a project name (e.g., `saassum-ai-commerce`), select a database password, and choose your preferred region.
4. Wait 1–2 minutes for the database cluster to initialize.

---

## 2. Run the SQL Schema

1. In your Supabase dashboard, click on the **SQL Editor** tab (icon `>_` on the left sidebar).
2. Click **New Query**.
3. Copy the full contents of [`database/schema.sql`](../database/schema.sql) and paste it into the query window.
4. Click **Run** (or press `Ctrl+Enter`).
5. (Optional) Run [`database/seed.sql`](../database/seed.sql) to populate a sample starter project.

---

## 3. Retrieve Your Connection String

1. In Supabase, go to **Project Settings** (gear icon) -> **Database**.
2. Scroll to **Connection string** and select the **URI** or **JDBC** tab.
3. The format is:
   ```
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```
4. For Spring Boot JDBC connection, the URL format is:
   ```properties
   spring.datasource.url=jdbc:postgresql://aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
   spring.datasource.username=postgres.[YOUR-PROJECT-REF]
   spring.datasource.password=your_database_password
   ```

---

## 4. Configure the Spring Boot Backend

You can set these in your environment variables or in `backend/src/main/resources/application.properties` (or `backend/.env`):

```bash
# In your terminal or .env
SPRING_DATASOURCE_URL=jdbc:postgresql://[host]:5432/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.[ref]
SPRING_DATASOURCE_PASSWORD=your_password
```

### 💡 Offline / Demo Fallback Mode
If Supabase credentials are not provided or if you are running locally without an internet connection, the Spring Boot backend **automatically falls back to an embedded in-memory H2 database** with identical JPA entities. You can run and test all features without requiring Supabase right away!
