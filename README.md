# TESO - Guía de Configuración y KPIs

## 📋 Índice
1. [Variables de Entorno](#variables-de-entorno)
2. [Cómo Correr Localmente](#cómo-correr-localmente)
3. [Arquitectura del Backend](#arquitectura-del-backend)
4. [KPIs Implementados](#kpis-implementados)
5. [Rutas de la App](#rutas-de-la-app)
6. [Capturas en Supabase](#capturas-en-supabase)

---

## 🔐 Variables de Entorno

El proyecto ya incluye las variables de entorno necesarias en el archivo `.env`:

```env
VITE_SUPABASE_PROJECT_ID="uzwjiviiqxwgalrnpjuz"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://uzwjiviiqxwgalrnpjuz.supabase.co"
```

**Nota:** Estas variables ya están configuradas automáticamente por Lovable Cloud. No es necesario modificarlas.

---

## 🚀 Cómo Correr Localmente

### Prerrequisitos
- Node.js 18+ instalado
- npm o bun instalado

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <tu-repo-url>
cd teso-fitness

# 2. Instalar dependencias
npm install
# o
bun install

# 3. Iniciar el servidor de desarrollo
npm run dev
# o
bun run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🏗️ Arquitectura del Backend

### Base de Datos (Supabase)

#### Tablas Principales

**1. `profiles`** - Perfiles de usuario
- `id` (UUID, FK a auth.users)
- `full_name` (TEXT)
- `username` (TEXT)
- `avatar_url` (TEXT)
- `bio` (TEXT)

**2. `posts`** - Publicaciones del feed
- `id` (UUID)
- `user_id` (UUID, FK a profiles)
- `content` (TEXT)
- `image_urls` (TEXT[])
- `location` (TEXT)
- `created_at` (TIMESTAMP)

**3. `post_likes`** - Likes en publicaciones
- `id` (UUID)
- `post_id` (UUID, FK a posts)
- `user_id` (UUID, FK a profiles)
- `created_at` (TIMESTAMP)

**4. `post_comments`** - Comentarios en publicaciones
- `id` (UUID)
- `post_id` (UUID, FK a posts)
- `user_id` (UUID, FK a profiles)
- `content` (TEXT)
- `created_at` (TIMESTAMP)

**5. `user_xp`** - Sistema de experiencia
- `id` (UUID)
- `user_id` (UUID, FK a profiles)
- `total_xp` (INTEGER)
- `current_level` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**6. `xp_transactions`** - Historial de XP
- `id` (UUID)
- `user_id` (UUID, FK a profiles)
- `amount` (INTEGER)
- `action` (TEXT)
- `description` (TEXT)
- `created_at` (TIMESTAMP)

**7. `activity_events`** - Eventos de tracking
- `id` (UUID)
- `user_id` (UUID, FK a profiles)
- `event_type` (ENUM: signup, login, post_created, post_liked, etc.)
- `metadata` (JSONB)
- `created_at` (TIMESTAMP)

**8. `storage_usage`** - Uso de almacenamiento
- `id` (UUID)
- `user_id` (UUID, FK a profiles)
- `file_path` (TEXT)
- `file_size` (BIGINT)
- `bucket_name` (TEXT)
- `created_at` (TIMESTAMP)

**9. `events`** - Eventos fitness (ya existente)
- Configuración de eventos y clases

#### Funciones Automáticas

**`add_xp_to_user(user_id, amount, action, description)`**
- Agrega XP a un usuario
- Actualiza nivel automáticamente
- Registra transacción en `xp_transactions`
- Dispara eventos de tracking

**`calculate_level(xp_amount)`**
- Calcula el nivel basado en XP total
- Niveles del 1 al 20

#### Triggers Automáticos

1. **`on_post_created`** - Otorga 100 XP al crear un post
2. **`on_post_liked`** - Otorga 10 XP al dar like
3. **`on_post_commented`** - Otorga 25 XP al comentar
4. **`on_profile_created`** - Inicializa XP al registrarse

#### Storage

**Bucket: `post-images`** (público)
- Almacena imágenes de posts
- Organizado por user_id/timestamp
- Políticas RLS configuradas

---

## 📊 KPIs Implementados

### Vistas SQL Disponibles

#### 1. `kpi_daily_signups`
**Métricas:** Registros diarios y acumulados
```sql
SELECT * FROM kpi_daily_signups ORDER BY signup_date DESC LIMIT 30;
```
- `signup_date`: Fecha del registro
- `signups_count`: Registros del día
- `cumulative_signups`: Registros acumulados

#### 2. `kpi_daily_active_users`
**Métricas:** Usuarios activos por día
```sql
SELECT * FROM kpi_daily_active_users ORDER BY activity_date DESC LIMIT 30;
```
- `activity_date`: Fecha de actividad
- `active_users`: Usuarios únicos activos

#### 3. `kpi_daily_posts`
**Métricas:** Posts creados por día
```sql
SELECT * FROM kpi_daily_posts ORDER BY post_date DESC LIMIT 30;
```
- `post_date`: Fecha de publicación
- `posts_count`: Número de posts
- `unique_users_posting`: Usuarios únicos publicando

#### 4. `kpi_xp_stats`
**Métricas:** Estadísticas de XP y niveles
```sql
SELECT * FROM kpi_xp_stats ORDER BY current_level;
```
- `avg_xp`: XP promedio
- `max_xp`: XP máximo
- `min_xp`: XP mínimo
- `current_level`: Nivel
- `users_at_level`: Usuarios en ese nivel

#### 5. `kpi_daily_xp_earned`
**Métricas:** XP ganado diariamente
```sql
SELECT * FROM kpi_daily_xp_earned ORDER BY xp_date DESC LIMIT 30;
```
- `xp_date`: Fecha
- `total_xp_earned`: XP total ganado
- `users_earning_xp`: Usuarios ganando XP
- `avg_xp_per_transaction`: Promedio por transacción

#### 6. `kpi_storage_usage`
**Métricas:** Uso de almacenamiento
```sql
SELECT * FROM kpi_storage_usage ORDER BY upload_date DESC LIMIT 30;
```
- `upload_date`: Fecha de subida
- `files_uploaded`: Archivos subidos
- `total_bytes`: Bytes totales
- `total_mb`: MB totales
- `unique_users_uploading`: Usuarios únicos subiendo

#### 7. `kpi_engagement_stats`
**Métricas:** Engagement del feed
```sql
SELECT * FROM kpi_engagement_stats ORDER BY engagement_date DESC LIMIT 30;
```
- `engagement_date`: Fecha
- `total_likes`: Likes totales
- `total_comments`: Comentarios totales
- `active_users`: Usuarios activos

### Acceso REST a KPIs

Todas las vistas están accesibles vía API REST de Supabase:

```javascript
// Ejemplo: Obtener signups diarios
const { data } = await supabase
  .from('kpi_daily_signups')
  .select('*')
  .order('signup_date', { ascending: false })
  .limit(30);
```

---

## 🗺️ Rutas de la App

### Rutas Públicas
- **`/`** - Página principal (requiere autenticación)
- **`/auth`** - Login y registro

### Rutas Autenticadas
- **`/`** - Dashboard principal con tabs:
  - 📱 **Feed** - Timeline de publicaciones
  - 🏋️ **Retos** - Desafíos fitness
  - 📅 **Eventos** - Eventos y clases
  - 🗺️ **Mapa** - Gimnasios cercanos
  - 👤 **Perfil** - Perfil de usuario con XP
  - 👥 **Social** - Red social fitness
  - 💬 **Chat** - Mensajería

### Ruta Admin
- **`/admin/kpis`** - Panel de métricas y KPIs
  - Visualización de todos los KPIs
  - Gráficos interactivos
  - Actualización en tiempo real

---

## 📸 Capturas en Supabase

### Checklist de Verificación

Para validar que todo funciona correctamente, puedes tomar las siguientes capturas en el backend de Lovable Cloud:

#### 1. **Tabla de Usuarios (`profiles`)**
- Ir a: Backend → Table Editor → profiles
- Verificar usuarios registrados

#### 2. **Posts Creados (`posts`)**
- Ir a: Backend → Table Editor → posts
- Verificar posts con imágenes

#### 3. **Sistema de XP (`user_xp`)**
- Ir a: Backend → Table Editor → user_xp
- Verificar XP y niveles de usuarios

#### 4. **Eventos de Actividad (`activity_events`)**
- Ir a: Backend → Table Editor → activity_events
- Verificar eventos de signup, posts, likes, etc.

#### 5. **Storage de Imágenes**
- Ir a: Backend → Storage → post-images
- Verificar carpetas de usuarios e imágenes

#### 6. **KPI: Signups Diarios**
```sql
SELECT * FROM kpi_daily_signups ORDER BY signup_date DESC LIMIT 10;
```

#### 7. **KPI: Posts Diarios**
```sql
SELECT * FROM kpi_daily_posts ORDER BY post_date DESC LIMIT 10;
```

#### 8. **KPI: XP Stats**
```sql
SELECT * FROM kpi_xp_stats ORDER BY current_level;
```

#### 9. **KPI: Storage Usage**
```sql
SELECT * FROM kpi_storage_usage ORDER BY upload_date DESC LIMIT 10;
```

#### 10. **KPI: Engagement**
```sql
SELECT * FROM kpi_engagement_stats ORDER BY engagement_date DESC LIMIT 10;
```

---

## 🎯 Flujo de Demo Completo

### 1. Registro de Usuario
1. Ir a `/auth`
2. Crear cuenta nueva (email, contraseña, nombre, username)
3. **Evento generado:** `signup` en `activity_events`
4. **XP inicial:** Usuario creado en `user_xp` con 0 XP, nivel 1

### 2. Crear Post con Imagen
1. Ir a `/` → Tab "Feed"
2. Click en botón "Crear Post"
3. Escribir contenido y subir 1-2 imágenes
4. Publicar
5. **Eventos generados:**
   - Post guardado en `posts`
   - Imágenes en Storage `post-images`
   - Registro en `storage_usage`
   - Evento `post_created` en `activity_events`
   - **+100 XP** automático en `user_xp`
   - Transacción en `xp_transactions`

### 3. Ver XP en Perfil
1. Ir a tab "Perfil"
2. Ver XP Bar en la parte superior
3. Verificar nivel y XP
4. Ver progreso hacia siguiente nivel

### 4. Dashboard de KPIs
1. Ir a `/admin/kpis`
2. Ver tarjetas de resumen:
   - Signups totales
   - Posts creados
   - XP promedio
   - Storage usado
3. Ver gráficos:
   - Signups diarios (barras)
   - Posts diarios (líneas)
   - Distribución de niveles (pie)
   - XP ganado diario (barras)
   - Engagement (líneas)
   - Storage usage (barras)

### 5. Verificar en Supabase Backend
1. Abrir Lovable Cloud → View Backend
2. Revisar tablas mencionadas en el checklist
3. Ejecutar queries de KPIs
4. Verificar Storage

---

## 🔧 Mantenimiento y Monitoreo

### Queries Útiles

**Ver usuarios más activos:**
```sql
SELECT 
  p.full_name, 
  p.username,
  ux.total_xp,
  ux.current_level,
  COUNT(po.id) as total_posts
FROM profiles p
LEFT JOIN user_xp ux ON p.id = ux.user_id
LEFT JOIN posts po ON p.id = po.user_id
GROUP BY p.id, p.full_name, p.username, ux.total_xp, ux.current_level
ORDER BY ux.total_xp DESC;
```

**Ver actividad reciente:**
```sql
SELECT 
  ae.event_type,
  ae.created_at,
  p.username,
  ae.metadata
FROM activity_events ae
JOIN profiles p ON ae.user_id = p.id
ORDER BY ae.created_at DESC
LIMIT 50;
```

**Ver top posts por engagement:**
```sql
SELECT 
  po.content,
  p.username,
  COUNT(DISTINCT pl.id) as likes_count,
  COUNT(DISTINCT pc.id) as comments_count
FROM posts po
JOIN profiles p ON po.user_id = p.id
LEFT JOIN post_likes pl ON po.id = pl.post_id
LEFT JOIN post_comments pc ON po.id = pc.post_id
GROUP BY po.id, po.content, p.username
ORDER BY (COUNT(DISTINCT pl.id) + COUNT(DISTINCT pc.id)) DESC
LIMIT 10;
```

---

## 📝 Notas Importantes

1. **Auto-confirm Email:** El sistema tiene auto-confirmación de email activada para testing. Los usuarios pueden registrarse y entrar inmediatamente sin verificar email.

2. **XP Automático:** El sistema otorga XP automáticamente mediante triggers de base de datos:
   - Crear post: +100 XP
   - Dar like: +10 XP
   - Comentar: +25 XP

3. **Niveles:** Los niveles van del 1 al 20 con los siguientes umbrales de XP:
   - Nivel 1: 0 XP
   - Nivel 2: 500 XP
   - Nivel 3: 1,200 XP
   - ...
   - Nivel 20: 42,000 XP

4. **Storage:** Las imágenes se almacenan en `post-images` bucket con estructura: `{user_id}/{timestamp}-{random}.jpg`

5. **Real-time:** El XP Bar se actualiza en tiempo real usando Supabase Realtime cuando se gana XP.

---

## 🎨 Brand & Design

- **Colores:** Sistema de diseño basado en tokens semánticos definidos en `src/index.css`
- **Gradientes:** Gradientes hero y primarios configurados
- **Componentes:** Basados en shadcn/ui con variantes personalizadas

---

## 🐛 Troubleshooting

**Error al crear post:**
- Verificar que estás autenticado
- Verificar que el bucket `post-images` existe
- Verificar políticas RLS de Storage

**XP no se actualiza:**
- Verificar triggers en la base de datos
- Verificar que el usuario tiene registro en `user_xp`
- Revisar logs de Supabase

**KPIs no cargan:**
- Verificar que las vistas SQL existen
- Verificar permisos de lectura
- Revisar errores en consola del navegador

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Lovable Docs](https://docs.lovable.dev/)

---

**Última actualización:** 2025-01-20
**Versión:** 1.0.0
