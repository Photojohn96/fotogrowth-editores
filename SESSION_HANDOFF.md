# 🎬 FotoGrowth Editores — Session Handoff

> Generado 2026-05-17. Si arrancás una nueva sesión de Claude Code en este repo,
> léeme PRIMERO. Contiene todo el contexto necesario para continuar sin re-explicar.

---

## 📍 Status actual: LIVE en producción

| Componente | URL/ID | Status |
|---|---|---|
| **Sitio público** | https://editores.fotogrowth.com | ✅ HTTP 200 |
| Vercel project | john-2506s-projects/fotogrowth-editores | ✅ |
| Supabase project | mtrbtgxytfxendtdmiva | ✅ |
| GitHub repo | github.com/Photojohn96/fotogrowth-editores | ✅ |
| DNS GoDaddy | A `editores` → `76.76.21.21` | ✅ propagado |
| SSL Let's Encrypt | Auto-renovado por Vercel | ✅ |

---

## 🗺️ Páginas y rutas

| Ruta | Qué hace | Privado? |
|---|---|---|
| `/` | Landing splash con dual CTA (Pixlmob-style). Stats live de editores aprobados. | Público |
| `/directorio` | Grid de editores aprobados con filtros (idioma, precio dinámico, disponibilidad, tipo video, entrega). Sort: available_now → limited → full → newest. | Público |
| `/aplicar` | Form multi-step 5 pasos con validación por paso | Público |
| `/editor/[slug]` | Perfil público del editor con CTA WhatsApp deep-link | Público |
| `/admin` | Dashboard de aprobación con password gate | Protegido |
| `/api/submit` | POST endpoint para form submissions | Público (rate-limit pendiente) |
| `/api/approve` | POST con header `x-admin-password` para approve/reject | Protegido |

**Admin password actual:** `fotogrowth-admin-2026` (cambiar antes del IG launch).

---

## 🛠️ Stack técnico

- **Next.js 14** App Router · TypeScript · TailwindCSS
- **Supabase** Postgres + Auth + Storage (free tier)
- **Vercel** Hobby plan (free, 100 GB bandwidth/mo)
- **@vercel/analytics** instrumentado

### Estructura archivos clave
```
app/
  page.tsx              ← Landing splash (server component, fetches counts)
  directorio/page.tsx   ← Grid + filters (client, dynamic price bands)
  aplicar/page.tsx      ← Multi-step form (5 pasos, validation per step)
  editor/[slug]/page.tsx ← Profile detail (server, WhatsApp deep-link)
  admin/page.tsx        ← Approval dashboard (client, password gate)
  api/
    submit/route.ts     ← Insert pending editor
    approve/route.ts    ← Update status (admin auth via header)
components/
  Nav.tsx
  EditorCard.tsx        ← Availability badge + price/turnaround
  DirectoryFilters.tsx  ← Dynamic bands, unit filter, availability primary
lib/
  supabase.ts           ← Public + admin clients, makeSlug helper
  types.ts              ← Editor, EditorSubmission, DirectoryFilters, PriceBand
  constants.ts          ← VIDEO_TYPES, LANGUAGES, AVAILABILITY_OPTIONS, etc
  priceBands.ts         ← computePriceBands() — quartiles + nice rounding
supabase-schema.sql     ← Initial schema (already applied to prod)
```

---

## 🔐 Credenciales y env vars (Vercel production)

> El archivo `.env.local` tiene los mismos valores para dev local. Está gitignored.

| Var | Valor (truncado) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mtrbtgxytfxendtdmiva.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` (formato nuevo, ver `.env.local`) |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` (privado, ver `.env.local` o Vercel env) |
| `ADMIN_PASSWORD` | configurado en Vercel (cambiar antes del launch) |
| `NEXT_PUBLIC_URL` | `https://editores.fotogrowth.com` |

> ⚠️ Los valores reales NO se commitean a git. Están en:
> - `.env.local` (gitignored) en este repo para dev
> - Vercel env vars (production) — pullable con `npx vercel env pull`
> - Si necesitás rotarlos: https://supabase.com/dashboard/project/mtrbtgxytfxendtdmiva/settings/api-keys

**Para verlas/editarlas:**
```bash
cd /Users/johnruz/JohnOS/fotogrowth-editores
npx vercel env ls
# Para cambiar una:
echo "NUEVO_VALOR" | npx vercel env add NOMBRE production --force
npx vercel deploy --prod --yes
```

---

## 💾 Schema Supabase

Tabla única: `editors` (20 columnas + 1 nueva: `availability`)

```sql
- id (uuid, pk)
- created_at (timestamptz)
- status (text: pending | approved | rejected)
- name, email (unique), whatsapp, city, country, ig_handle
- video_types (text[]) — ids como 'video_tour', 'twilight', 'drone_reels'...
- languages (text[]) — 'es', 'en', 'pt', 'fr', 'it'
- turnaround (text) — '24h' | '48h' | '72h' | '1week' | 'flexible'
- price_min_usd, price_max_usd (integer)
- price_unit (text: 'project' | 'video')
- portfolio_url, portfolio_extras (text + text[])
- bio (text, 280 chars max)
- availability (text: 'available_now' | 'limited' | 'full')
- approved_at (timestamptz), slug (text, unique)
```

**Row Level Security:**
- Anon (browser) puede SELECT solo donde `status = 'approved'`
- Service role bypassa RLS (API routes)

**Dashboard Excel-like:** https://supabase.com/dashboard/project/mtrbtgxytfxendtdmiva/editor

**MCP de Supabase ya instalado** (user scope):
- Tools disponibles: `mcp__3d8a115a-...__execute_sql`, `apply_migration`, `list_tables`, `get_logs`, etc.
- No requiere re-auth — el token está cacheado.

---

## 🔄 Flujo end-to-end

```
Editor ve IG post de John → comenta "EDITOR"
       ↓
ManyChat trigger (pendiente: setearlo aún) → DM con link a /aplicar
       ↓
Editor completa form 5 pasos → POST /api/submit
       ↓
Row guardada con status='pending', slug auto-generado
       ↓
Editor NO aparece en directorio (RLS bloquea pending)
       ↓
John entra a /admin con password → ve pending → click "Aprobar"
       ↓
status='approved' → editor aparece en /directorio público
       ↓
Fotógrafo (visitante) filtra por idioma/precio/disponibilidad
       ↓
Click en card → ve perfil completo + botón "Contactar por WhatsApp"
       ↓
WhatsApp abre con mensaje pre-llenado mencionando FotoGrowth
```

---

## 🎨 Decisiones de diseño tomadas

### Landing `/` (splash style)
- Hero limpio con badge "Directorio curado por FotoGrowth" + dot verde pulsante
- H1: "Editores de video para bienes raíces"
- Dual CTA: "Ver el directorio →" (primary) + "Aplicar como editor" (ghost)
- Stats live: "X editores · Y países · Z disponibles ya" (solo si hay aprobados)
- Sección "Cómo funciona" — 3 cards (Encuentra / Contacta / Trabaja)
- Sección "¿Eres editor?" recruitment con CTA a /aplicar
- Footer simple con link a fotogrowth.com

### Directorio `/directorio`
- Sidebar sticky con filtros, grid 2-col en desktop
- **Sort default: available_now → limited → full → newest** (mejor descubribilidad para activos)
- **Bandas de precio dinámicas**: calculadas con quartiles de la data real, redondeadas a números bonitos (5/25/50/100/500). Se recalculan al cambiar el filtro de unidad.
- **Filtro "Tipo de precio" primero** (proyecto/video) — para no mezclar peras con manzanas
- Skeleton loader mientras carga
- Empty states distintos: "filtros sin match" vs "directorio arrancando"

### Form `/aplicar`
- 5 pasos con progress bar
- Validación por paso (botón Siguiente disabled hasta que cumpla)
- Step 1: Básico (nombre, email, WhatsApp, ciudad, país, IG)
- Step 2: Servicios (video types multi-select + languages multi-select)
- Step 3: Precio + tiempo + **DISPONIBILIDAD** (nuevo, 3 opciones con emoji + color)
- Step 4: Portfolio link + extras + bio (280 chars)
- Step 5: Review todo antes de submit
- Confirmación: "Recibido! Revisamos en 24-48h"

### EditorCard
- Badge de disponibilidad arriba a la derecha (verde/amarillo/rojo)
- Precio + turnaround en row separado
- Bio truncado 2 líneas
- Video types chips (max 4 + counter)
- Idiomas como labels minimal abajo
- Hover state con CTA "Ver perfil →"

### Perfil `/editor/[slug]`
- Header con name + badge disponibilidad + ubicación + IG link
- Bio destacada
- Card grande con precio + entrega + botón WhatsApp verde
- 2-col: tipos de video / idiomas
- Portfolio links (principal con highlight + extras)
- Footer con disclaimer "FotoGrowth no media en la transacción"

---

## 📅 Historia de cambios (commits importantes)

1. `Initial commit` — scaffold completo, 18 archivos, 1690 líneas
2. `Add QUICK_START.md` — deploy guide para deploy manual
3. `Add DEPLOY_NOW.md` — post-GitHub steps
4. `Add availability field, dual-CTA landing splash, /directorio page, modernize design`
   - SQL migration: column `availability`
   - Refactor /page.tsx a splash, mover grid a /directorio
   - VIDEO_TYPES: Video Tour agregado/clarificado
   - PRICE_UNITS simplificado a project/video
   - LANGUAGES: + French, Italian
5. `Directory: dynamic price bands from actual data + price_unit filter`
   - lib/priceBands.ts: quartiles + nice rounding
   - Bands recompute on price_unit change
   - UI shows count per band
   - Auto-clears stale band selection

---

## ⏳ Lo que falta (roadmap pendiente)

### Pre-launch (críticos antes de IG video)
- [ ] **Cambiar ADMIN_PASSWORD** a algo más fuerte
- [ ] **ManyChat trigger** keyword "EDITOR" → DM con link al /aplicar
- [ ] **Grabar reel IG** (script en `IG_VIDEO_SCRIPT.md`)
- [ ] **Test end-to-end manual** — completar form real, aprobar desde admin, ver en directorio

### Nice to have (post-launch, según volumen)
- [ ] **Email automático al editor cuando lo apruebas** (Resend, $0 hasta 3K/mo)
- [ ] **Cron anti-pausa Supabase Free** (ping cada 5 días desde Vercel Cron)
- [ ] **Reviews/ratings** 1-5⭐ de fotógrafos sobre editores
- [ ] **Featured tier $19/mo** — monetización editores premium
- [ ] **Antes/después grid** en perfil de editor (Supabase Storage)
- [ ] **Email notifications** al editor cuando lo contactan
- [ ] **Stripe Connect** para tomar comisión sobre cada match
- [ ] **Multi-idioma del sitio** (inglés/portugués) para alcance global
- [ ] **Open Graph image dinámica** para que los links se vean lindos al compartir
- [ ] **Rate limiting** en `/api/submit` (anti-spam)

### Costos proyectados
- Hoy → mes 6: **$0/mes**
- Mes 6-12: **$0-25/mes** (probable upgrade a Supabase Pro)
- Mes 12+: **$25-45/mes**

---

## 🛠️ Comandos útiles

### Deploy nuevo
```bash
cd /Users/johnruz/JohnOS/fotogrowth-editores
git add -A && git commit -m "..." && git push
DEPLOY=$(npx vercel deploy --prod --yes | grep -oE "https://[^ ]+vercel\.app" | tail -1)
npx vercel alias set "$DEPLOY" editores.fotogrowth.com
```

### Verificar todo
```bash
ip=$(dig +short editores.fotogrowth.com @8.8.8.8 | head -1)
for path in / /directorio /aplicar /admin; do
  /usr/bin/curl -sk -o /dev/null --resolve "editores.fotogrowth.com:443:$ip" \
    -w "$path → %{http_code}\n" "https://editores.fotogrowth.com$path"
done
```

### Correr SQL en Supabase (vía MCP)
```
Usar tool: mcp__3d8a115a-1367-42e1-89bf-9a538ea534c4__execute_sql
project_id: mtrbtgxytfxendtdmiva
query: "SELECT * FROM editors;"
```

### Ver logs en vivo
```bash
cd /Users/johnruz/JohnOS/fotogrowth-editores
npx vercel logs --follow
```

---

## 👤 Preferencias de John (importante)

1. **Español venezolano** — usar tuteo + vocabulario vzla en chat ("chamo", "vale", "burda", "fino", "vaina"). NO en copy de productos (audiencia mixta LATAM, neutro).
2. **No hablar como cumpa argentino** — nada de "tenés/querés/decime"
3. **Direct + acción** — ejecutar más, preguntar menos
4. **Verificar antes de afirmar** — no decir "está listo" sin verificar reload/test
5. **Honestidad técnica** — si hay un wall, decirlo, no fingir éxito

---

## 🔗 Referencias rápidas

- **Inspiración landing:** https://www.pixlmob.com/ (marketplace style, dual CTA)
- **Brand colors:** FotoGrowth dark (#0A0A0A bg + fg-azul primary + fg-acento amber)
- **Tone of voice product:** Español latam neutro, mentor, sin fluff
- **Tone of voice chat con John:** Venezuelan, casual, directo

---

## 🎯 Mensaje para arrancar nueva sesión

> "Trabajamos en `/Users/johnruz/JohnOS/fotogrowth-editores`. Leé primero
> `SESSION_HANDOFF.md` para entender el contexto completo (stack, status,
> credenciales, decisiones tomadas, roadmap). El sitio está LIVE en
> editores.fotogrowth.com. Hablame en español venezolano."

Esto le da toda la información en una sola lectura.
