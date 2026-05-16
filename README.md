# FotoGrowth · Directorio de Editores RE

Directorio curado de editores de video para fotografía/video inmobiliario.
Capturás editores vía landing pública, vos aprobás desde admin, miembros de
FotoGrowth los descubren + contactan por WhatsApp.

## Stack
- **Next.js 14** (App Router)
- **TypeScript + TailwindCSS**
- **Supabase** (Postgres + Auth + Storage en uno)
- **Vercel** (hosting)
- **@vercel/analytics**

## Estructura
```
app/
  page.tsx            ← Landing + directorio con filtros
  aplicar/page.tsx    ← Form multi-step (5 pasos) para editores
  editor/[slug]/      ← Página perfil pública del editor
  admin/page.tsx      ← Tu dashboard de aprobación
  api/
    submit/           ← POST → guarda editor en DB (status pending)
    approve/          ← Admin password → cambia status approved/rejected
components/
  Nav.tsx
  EditorCard.tsx
  DirectoryFilters.tsx
lib/
  supabase.ts         ← clientes anon + service role
  types.ts            ← shape de Editor + Filters
  constants.ts        ← video types, idiomas, países, ranges
```

---

## 🚀 Deploy en 4 pasos (~30 min)

### 1. Setup Supabase (5 min)
1. Andá a https://supabase.com → New project
2. Nombre: `fotogrowth-editores` · password lo que quieras
3. Region: South America (East) — closer a LATAM
4. Cuando termine, andá a SQL Editor → New query
5. Copiá y pegá todo `supabase-schema.sql` → Run
6. Settings → API → copiá:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY) — **NUNCA** lo expongas en cliente

### 2. Local dev (opcional, para probar antes de deploy)
```bash
cd /Users/johnruz/JohnOS/fotogrowth-editores
cp .env.example .env.local
# Editar .env.local con tus keys de Supabase + ADMIN_PASSWORD
npm install
npm run dev
# → abrí http://localhost:3000
```

### 3. Deploy a Vercel
1. `git init && git add . && git commit -m "init"`
2. Push a un repo nuevo en GitHub (`fotogrowth-editores`)
3. Andá a https://vercel.com → New Project → Import repo
4. Framework: Next.js (auto)
5. Environment Variables — agregá las 4:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` (algo fuerte)
   - `NEXT_PUBLIC_URL` (lo seteás después con el subdominio)
6. Deploy

### 4. Custom domain (5 min)
1. Vercel project → Settings → Domains → Add: `editores.fotogrowth.com`
2. Vercel te da un CNAME → andá a tu DNS provider (donde manejás fotogrowth.com) y agregá:
   - Type: `CNAME` · Name: `editores` · Value: `cname.vercel-dns.com`
3. Esperá 1-5 min, Vercel auto-detecta y emite SSL

✅ **LIVE.** El form vive en `editores.fotogrowth.com/aplicar`, el admin en `/admin`.

---

## 🎬 Cómo lanzar en Instagram

Posteá un reel/post con esto:

> "Estoy armando el primer directorio de editores de video para bienes raíces en español.
> Si editás listing videos / drone / twilight, comentá **EDITOR** y te paso el link
> para entrar gratis al directorio."

→ Cuando comenten "EDITOR", ManyChat (AI Remote Closer) responde con el link a
`editores.fotogrowth.com/aplicar`.

> Bonus: postea con un thumbnail tipo "Quiero pagarles a editores de video — pero no
> encuentro los que entreguen rápido y bueno" para captar a los fotógrafos también
> (futuros buyers de FotoGrowth).

### Trigger en ManyChat (a configurar después)
Trigger: comments contain "EDITOR" → response automático con link a /aplicar.
Igual que ya tenés PRECIO / HDR / FOTO.

---

## ⚙️ Cómo funciona el flow

```
1. Editor ve tu IG → comenta "EDITOR"
2. ManyChat manda link a editores.fotogrowth.com/aplicar
3. Editor completa form 5 pasos → POST /api/submit
4. Row se guarda con status='pending'
5. Vos entrás a /admin con tu password → ves pending
6. Click "Aprobar" → status='approved' → aparece en directorio público
7. Miembro de FotoGrowth entra a editores.fotogrowth.com
8. Filtra + clickea editor → ve perfil → click "Contactar por WhatsApp"
9. WhatsApp abre con mensaje pre-llenado mencionando FotoGrowth
```

---

## 🔄 Roadmap v2 (cuando tengas 30+ editores aprobados)

- **Gate el directorio** para members de FotoGrowth (sync con Kit `KIT_TAG_PAID_ID`)
- **Tier featured $19/mo** — editores pagan para aparecer arriba + badge
- **Reviews** — members votan/comentan editores con los que trabajaron
- **Filtro por país más granular** (no solo string)
- **Sort by**: rating, precio, turnaround
- **Email notifications** — cuando alguien te contacta como editor, te llega email
- **Sync Skool** — auto-add Skool members como `allowed_users`

---

## 📝 Notas de seguridad

- `SUPABASE_SERVICE_ROLE_KEY` solo se usa server-side (en route handlers). NUNCA en cliente.
- `ADMIN_PASSWORD` es simple por ahora — para v2 migrá a Supabase Auth con role admin.
- RLS protege que ningún anon pueda ver `pending` o `rejected`. Verificalo en Supabase Dashboard → Authentication → Policies.
- No hay rate limiting en `/api/submit` — si te spamean, agrega un check de email único (ya hay) y un captcha si crece.

---

## 🧪 Cómo testear local

```bash
npm run dev
```

1. Abrí http://localhost:3000 — debería mostrar empty state
2. Andá a /aplicar — completá el form de prueba
3. Andá a /admin → ingresá ADMIN_PASSWORD → aprobá tu submission
4. Volvé a / — el editor aparece en el grid ✓

Si algo falla, mirá la consola del browser + Vercel/Supabase logs.
