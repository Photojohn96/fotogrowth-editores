# 🚀 Deploy NOW — Los pasos que quedan (~20 min)

> Status actual:
> ✅ Código en GitHub: https://github.com/Photojohn96/fotogrowth-editores
> ✅ Build verificado limpio
> ⏳ Falta: Supabase + Vercel + DNS

---

## Paso 1 · Supabase (5 min) → https://supabase.com/dashboard

1. **New project**
   - Name: `fotogrowth-editores`
   - Database password: generala fuerte (guardala en 1Password)
   - Region: **South America (São Paulo)** o **East US** (más cercanos a LATAM)
   - Plan: **Free**
   - Click **Create new project** (espera ~2 min)

2. **SQL Editor** (sidebar izquierda) → **+ New query**
   - Abrir: `/Users/johnruz/JohnOS/fotogrowth-editores/supabase-schema.sql`
   - Copy ALL → paste en SQL Editor → **Run**
   - Debería decir: "Success. No rows returned"

3. **Settings → API** — copiá estos 3 valores en algún lado:
   ```
   Project URL  →  https://XXXXXX.supabase.co
   anon public  →  eyJhbG... (largo)
   service_role →  eyJhbG... (largo, DIFFERENT)
   ```
   ⚠️ La `service_role` es SECRETA. Nunca en código cliente.

---

## Paso 2 · Vercel deploy (5 min) → https://vercel.com/new

1. Click **Import Git Repository** → buscá `fotogrowth-editores` → Import
2. Framework Preset: **Next.js** (auto-detect)
3. Antes de hacer click Deploy → expandí **Environment Variables** → agregá las 5:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | El URL del Paso 1.3 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La `anon public` key |
   | `SUPABASE_SERVICE_ROLE_KEY` | La `service_role` key |
   | `ADMIN_PASSWORD` | Una contraseña fuerte que sólo vos sepas |
   | `NEXT_PUBLIC_URL` | `https://editores.fotogrowth.com` |

4. Click **Deploy** → espera ~90 seg
5. Te da un URL temporal tipo `fotogrowth-editores-xyz.vercel.app` — abrilo, debería cargar la landing vacía.

---

## Paso 3 · Custom domain (5 min)

### En Vercel:
1. Project → **Settings → Domains** → escribí `editores.fotogrowth.com` → **Add**
2. Vercel te muestra un CNAME para configurar — copialo

### En GoDaddy:
1. https://dcc.godaddy.com/ → DNS de `fotogrowth.com`
2. **Add** record:
   - Type: **CNAME**
   - Name: `editores`
   - Value: `cname.vercel-dns.com`
   - TTL: 1 hour
   - Save

### Volvé a Vercel:
- En 1-5 min auto-detecta + emite SSL
- Verás "✓ Valid Configuration"

✅ **LIVE en https://editores.fotogrowth.com**

---

## Paso 4 · Test end-to-end (3 min)

1. Abrí `https://editores.fotogrowth.com` → debería mostrar "El directorio está arrancando 🚀"
2. Click **"Aplicar al directorio"** → completá los 5 pasos con datos reales/test
3. Submit → "Recibido! ✅"
4. Abrí `https://editores.fotogrowth.com/admin` → metés tu `ADMIN_PASSWORD`
5. Tu submission aparece como **pending** → click **✓ Aprobar**
6. Volvé al `/` → tu editor aparece en el grid 🎉
7. Click la card → perfil → click **"💬 Contactar por WhatsApp"** → debería abrir WhatsApp con mensaje pre-llenado

Si algo falla, los logs viven en Vercel → Project → Logs.

---

## Paso 5 · ManyChat trigger (2 min)

1. https://app.manychat.com → Automation → **+ New Automation**
2. Trigger: **Instagram → User comments on Post or Reel**
3. Keyword contains: `EDITOR` (sin case-sensitive, captura todas las variantes)
4. Action: **Send Direct Message**:

```
Hey! Aquí el link para entrar al directorio gratis:

👉 https://editores.fotogrowth.com/aplicar

Toma 3 minutos. Yo reviso en 24-48h y te aviso cuando estés listo.

Cualquier duda me decís 🎬
```

5. **Save & Activate**

---

## Paso 6 · Grabar y postear el reel

Usá el script en `IG_VIDEO_SCRIPT.md` (en este mismo repo).

Tip pre-launch: pineá un comentario en tu post diciendo *"Comentá EDITOR para entrar al directorio gratis"* — eso aumenta CTR del trigger ~30%.

---

## 📊 Métricas a vigilar primeros 7 días

| Métrica | Dónde | Target |
|---|---|---|
| Visitors a /aplicar | Vercel Analytics | 100+ |
| Submissions completadas | Supabase → Table Editor → `editors` count | 30+ |
| Pending pendientes de aprobar | /admin pending tab | <20 (aprobá rápido) |
| Visitors al directorio | Vercel Analytics → `/` | crece después que apruebes 10+ |

---

## 🆘 Troubleshooting rápido

| Síntoma | Causa probable | Fix |
|---|---|---|
| Build falla en Vercel | Falta env var | Settings → Env Vars → verificá las 5 + Redeploy |
| Form da "Error guardando" | Service role key mal | Re-copiá la key desde Supabase, redeploy |
| Admin no entra | Password no matchea | Verificá `ADMIN_PASSWORD` case-sensitive |
| Editor aprobado no aparece | RLS policy mal | Supabase → Auth → Policies → reaplicá el SQL |
| Dominio no resuelve | DNS no propagó | Esperá hasta 24h, o `dig editores.fotogrowth.com` para verificar |

---

## 🎉 Cuando esté LIVE

Mandame el link cuando quieras y verifico end-to-end yo desde acá. Mientras, podés:
- Postear el reel de IG
- Aprobar tus primeros editores reales
- Compartir el directorio adentro de Skool (post pinneado: "Recurso nuevo: directorio de editores")
