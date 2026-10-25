# ATELIER VENDÔME — Monorepo de Lujo & Alta Joyería 3D

Plataforma de alta joyería personalizada con visualizador 3D en tiempo real (React Three Fiber / Three.js), e-commerce editorial, backend seguro en NestJS blindado contra Prototype Pollution, integración de pagos en Colombia (Wompi / PSE / Nequi / Tarjetas) y base de datos PostgreSQL / Supabase.

---

## 🚀 Despliegue en Vercel (1-Click o CLI)

Como asistente de IA no tengo acceso directo a tus credenciales de Vercel (por estrictas normas de seguridad y privacidad), pero este proyecto está **100% preconfigurado para Vercel**:

### Opción A: Desde GitHub a Vercel (Recomendada)
1. Descomprime este archivo `.zip`.
2. Inicializa git y súbelo a tu repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit atelier vendome"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/atelier-vendome.git
   git push -u origin main
   ```
3. Entra a [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New Project** -> Selecciona tu repositorio.
4. En **Root Directory**, selecciona `apps/web` (o deja la raíz con `vercel.json`).
5. Agrega las variables de entorno (`.env.example`) y haz clic en **Deploy**.

### Opción B: Con Vercel CLI
```bash
pnpm install -g vercel
cd apps/web
vercel
```

---

## 🗄️ Conexión a Base de Datos (Supabase / PostgreSQL)

1. En **Supabase** (o tu PostgreSQL local):
   - Crea un nuevo proyecto en [supabase.com](https://supabase.com).
   - En **Project Settings -> Database**, copia la URL de conexión en modo Transaction pooler o Direct:
     `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
2. Configura tu archivo `.env` en `apps/api` o en `packages/database`:
   ```env
   DATABASE_URL="postgresql://postgres:tu_password@db.supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:tu_password@db.supabase.co:5432/postgres"
   ```
3. Ejecuta las migraciones de Prisma:
   ```bash
   pnpm db:push
   # o para generar el cliente:
   pnpm db:generate
   ```

---

## 📦 Estructura del Monorepo

- `apps/web`: Next.js 14/15 (App Router), React Three Fiber, Zustand (Carrito y personalizador 3D), Checkout Wompi Colombia.
- `apps/api`: Backend NestJS, protección contra Prototype Pollution, cálculo criptográfico SHA-256 de Wompi, webhooks y API de órdenes.
- `packages/database`: Prisma ORM configurado con modelos de Joyas, Gemas, Metales, Carrito y Órdenes para PostgreSQL / Supabase.
- `packages/types`: Interfaces TypeScript compartidas.