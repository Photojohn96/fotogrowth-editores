# 🚀 Quick Start — Lo único que TÚ tenés que hacer

> Todo lo demás (código + tests + git commit + docs) ya está hecho.
> Estos son los pasos que requieren TU login o tarjeta. ~25 minutos total.

---

## Pre-requisitos
- Cuenta Supabase (gratis): https://supabase.com
- Cuenta Vercel (gratis): https://vercel.com (ya la tenés)
- Cuenta GitHub (para push del repo)
- Acceso a tu DNS de fotogrowth.com (probablemente GoDaddy)

---

## Paso 1 — Crear proyecto Supabase · 5 min

1. https://supabase.com → **New project**
2. Settings:
   - Name: `fotogrowth-editores`
   - Database password: generala fuerte y **guárdala** (la necesitás si entrás por SQL CLI)
   - Region: **South America (East)** — closer a tus users LATAM
   - Plan: Free
3. Esperá ~2 min a que se cree el proyecto
4. **SQL Editor** (sidebar izq) → **New query** → copiá TODO el contenido de:
   ```
   /Users/johnruz/JohnOS/fotogrowth-editores/supabase-schema.sql
   ```
   Pegalo y click **RUN** → debería decir "Success"
5. **Settings → API** (sidebar izq) → copiá estos 3 valores:
   - `Project URL` (algo como `https://abcxyz.supabase.co`)
   - `anon public` key (empieza con `eyJ...`)
   - `service_role` key (empieza con `eyJ...` — **NUNCA** la expongas en cliente, solo Vercel env)

---

## Paso 2 — Push a GitHub · 5 min

```bash
cd /Users/johnruz/JohnOS/fotogrowth-editores
```

1. Andá a https://github.com/new → repo name: `fotogrowth-editores` → **Private** (recomendado) → Create
2. GitHub te muestra comandos para push. Copiá lo que dice (algo así):
   ```bash
   git remote add origin git@github.com:TU-USUARIO/fotogrowth-editores.git
   git push -u origin main
   ```
3. Ejecutalos. Debería pushear los 18 archivos + commit inicial.

---

## Paso 3 — Deploy en Vercel · 5 min

1. https://vercel.com/new → **Import Git Repository** → seleccioná `fotogrowth-editores`
2. Framework: **Next.js** (auto-detect)
3. Antes de Deploy: expandí **Environment Variables** y agregá las 5:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | El URL del paso 1.5 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La anon key del paso 1.5 |
   | `SUPABASE_SERVICE_ROLE_KEY` | La service_role key del paso 1.5 |
   | `ADMIN_PASSWORD` | Una contraseña fuerte que sólo vos sepas (8+ chars) |
   | `NEXT_PUBLIC_URL` | `https://editores.fotogrowth.com` (lo seteamos al final) |

4. Click **Deploy** → esperá 1-2 min
5. Vercel te da un URL temporal tipo `fotogrowth-editores-abc.vercel.app` → abrilo para verificar que carga

---

## Paso 4 — Custom domain · 5 min

1. En Vercel project → **Settings → Domains** → **Add** → escribí: `editores.fotogrowth.com` → Add
2. Vercel te muestra un CNAME que tenés que agregar:
   ```
   Type:  CNAME
   Name:  editores
   Value: cname.vercel-dns.com
   ```
3. Andá a tu DNS provider (GoDaddy):
   - GoDaddy → My Products → DNS de fotogrowth.com → **Add** → CNAME con los datos de arriba
4. Volvé a Vercel → en 1-5 min auto-detecta + emite SSL gratis. Verás "✓ Valid Configuration"

✅ **LIVE en `https://editores.fotogrowth.com`**

---

## Paso 5 — Test end-to-end · 3 min

1. Abrí `https://editores.fotogrowth.com` → debería mostrar empty state ("El directorio está arrancando")
2. Click **"Aplicar al directorio"** → completá los 5 pasos con datos de prueba (usá tu email)
3. Submit → debería mostrar ✅ "Recibido!"
4. Abrí `https://editores.fotogrowth.com/admin` → metés el `ADMIN_PASSWORD` que pusiste
5. Debería aparecer tu submission como "pending" → click **✓ Aprobar**
6. Volvé a `https://editores.fotogrowth.com/` → tu editor de prueba debería aparecer 🎉
7. Click en el card → te lleva al perfil → click **"💬 Contactar por WhatsApp"** → abre WA con mensaje pre-llenado
8. **Opcional:** volvé a admin y rechazá la submission de prueba para limpiarla (o borrala desde Supabase Table Editor)

---

## Paso 6 — ManyChat trigger "EDITOR" · 2 min

1. https://app.manychat.com → Automation → **+ New Automation**
2. Trigger: **Instagram → User comments on Post or Reel**
3. Keywords contains: `EDITOR, editor, Editor, editores, EDITORES`
4. Action: **Send Direct Message** con este texto:

```
Hey! Aquí el link para entrar al directorio gratis:

👉 https://editores.fotogrowth.com/aplicar

Toma 3 minutos. Yo reviso en 24-48h y te aviso cuando estés listo.

Cualquier duda me decís 🎬
```

5. **Save & Activate**

---

## Paso 7 — Grabar y postear el reel · ~30 min

Seguí el script en `IG_VIDEO_SCRIPT.md` (en este mismo repo).

---

## 🆘 Si algo falla

| Problema | Cómo arreglar |
|---|---|
| Form da error "Error guardando" | Verificá que las env vars de Supabase estén bien copiadas en Vercel + redeploy |
| Admin no entra | Verificá `ADMIN_PASSWORD` env var. Case-sensitive. |
| Editor aprobado no aparece en directorio | F5 fuerte (CMD+SHIFT+R). Si sigue, abrí Supabase Dashboard → Table Editor → `editors` → verificá `status='approved'` |
| WhatsApp link no abre | El editor no llenó WhatsApp en el form. Verificá en Supabase: row del editor, campo `whatsapp` |
| 404 en `/editor/[slug]` | El slug está mal o el editor no está approved. URL sensitive. |

---

## 📊 Cómo trackear performance los primeros 7 días

| Métrica | Dónde verla | Target sano |
|---|---|---|
| Visitors a /aplicar | Vercel Analytics | 100+ |
| Form completions | Supabase → editors table count | 30+ |
| Approval rate (vos juzgás) | /admin | 70%+ submissions decentes |
| Visitors al directorio público | Vercel Analytics → / | crece después que apruebes 10+ |
| WhatsApp link clicks | (no trackeable hoy) | qualitative — preguntá a editores si recibieron contactos |

---

**Resumen total: 18 archivos · 1,690 líneas · build limpio · committed.** Lo único que falta es tu deploy + DNS + ManyChat trigger. ~25 min de trabajo manual.
