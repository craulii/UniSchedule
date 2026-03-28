# UniSchedule

App web para estudiantes universitarios chilenos. Gestiona ramos, horarios por bloques, evaluaciones y promedios.

## Comandos

```bash
npm run dev      # Dev server en http://localhost:5173/UniSchedule/
npm run build    # Build produccion en dist/
npm run lint     # ESLint
npm run preview  # Preview del build
```

## Credenciales y Tokens

### Supabase (produccion)
- **URL**: `https://hrfdcdekbbiqneayrlma.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZmRjZGVrYmJpcW5lYXlybG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NzA5OTMsImV4cCI6MjA5MDE0Njk5M30.2T_FNXtkYXCOYk3U6UIMbGAil2sFvCgCdlcSZzvjX8E`
- **Dashboard**: https://supabase.com/dashboard (proyecto `hrfdcdekbbiqneayrlma`)
- La anon key es publica (seguridad via RLS). No hay service_role key en el frontend.

### GitHub
- **Repo**: `git@github.com:craulii/UniSchedule.git`
- **Pages**: https://craulii.github.io/UniSchedule/
- **Secrets** (Settings > Secrets > Actions): `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- Deploy automatico via `.github/workflows/deploy.yml` al pushear a `master`

## Stack

React 19 + Vite 6 + TailwindCSS 4 + Supabase (PostgreSQL + Auth) + Zustand 5 + React Router 7 (HashRouter) + GitHub Pages

## Arquitectura

### Patron de stores (Zustand)
Cada dominio tiene su store en `src/stores/` con el mismo patron:
- Estado: `items[], loading, error`
- Acciones: `fetch()`, `create()`, `update()`, `remove()`
- Todas las mutaciones usan **optimistic updates** con rollback en error
- Se usa `crypto.randomUUID()` como tempId durante la insercion optimista

### Rutas
```
/              → DashboardPage     (resumen + eventos proximos)
/subjects      → SubjectsPage      (CRUD de ramos)
/subjects/:id  → SubjectDetailPage (evaluaciones + notas de un ramo)
/schedule      → SchedulePage      (grilla horaria semanal)
/evaluations   → EvaluationsPage   (creacion rapida de evaluaciones)
/grades        → GradesPage        (promedios de todos los ramos)
/login         → LoginPage
/register      → RegisterPage
```

### Estructura de directorios clave
```
src/
  stores/         → authStore, subjectStore, scheduleStore, evaluationStore, categoryStore
  constants/      → blocks.js (8 bloques + almuerzo), evaluationTypes.js, priorities.js
  lib/            → supabase.js (cliente), gradeCalculator.js (funciones puras), subjectColors.js (paleta 12 colores)
  hooks/          → useGrades.js (promedios por ramo), useUpcoming.js (eventos proximos)
  components/ui/  → Button, Input, Select, Modal, Badge, Card, EmptyState, WeightIndicator
  pages/          → una pagina por ruta
```

## Base de Datos (Supabase PostgreSQL)

### Tablas
- `subjects` — ramos (name, code, professor)
- `schedules` — asignaciones horario (subject_id, day 1-5, block_key, room). Sin UNIQUE → permite topes
- `evaluation_categories` — categorias por ramo (name, weight%, sort_order)
- `evaluations` — evaluaciones (name, type, eval_date, grade 1.0-7.0, weight, priority, pinned, category_id)

### RLS
Cada tabla tiene 4 policies: SELECT/INSERT/UPDATE/DELETE filtradas por `auth.uid() = user_id`.

### Tipos de evaluacion (CHECK constraint)
```sql
CHECK (type IN ('certamen','control','tarea','proyecto','entrega','laboratorio','otro'))
```
Si el schema.sql original solo tiene los 5 primeros, ejecutar esta migracion:
```sql
ALTER TABLE evaluations DROP CONSTRAINT IF EXISTS evaluations_type_check;
ALTER TABLE evaluations ADD CONSTRAINT evaluations_type_check
  CHECK (type IN ('certamen','control','tarea','proyecto','entrega','laboratorio','otro'));
```

### Bloques horarios (fijos, no editables por el usuario)
| Bloque | Inicio | Fin   |
|--------|--------|-------|
| 1-2    | 08:15  | 09:25 |
| 3-4    | 09:40  | 10:50 |
| 5-6    | 11:05  | 12:15 |
| 7-8    | 12:30  | 13:40 |
| Almuerzo | 13:40 | 14:40 |
| 9-10   | 14:40  | 15:50 |
| 11-12  | 16:05  | 17:15 |
| 13-14  | 17:30  | 18:40 |
| 15-16  | 18:55  | 20:04 |

## Convenciones de codigo

- Todo el UI esta en **espanol** (labels, mensajes, botones)
- Colores de ramos via `getSubjectColor(index)` — paleta de 12 colores ciclica
- Componentes UI reutilizables en `src/components/ui/`
- Modales controlados con `useState({ open, ...params })`
- Notas en escala chilena: 1.0 a 7.0, aprobado >= 4.0
- Sin tests unitarios actualmente
- ESLint configurado, sin Prettier

## Funcionalidades principales

### Horario
- Grilla semanal Lun-Vie x 8 bloques + almuerzo
- Click en celda → modal de detalle: ver clases, editar sala, borrar, agregar nueva
- Soporta **topes horarios** (multiples ramos en un bloque, borde rojo + badge TOPE)

### Evaluaciones rapidas
- Pagina `/evaluations` con grilla de ramos
- Click ramo → seleccionar tipo → crear con nombre auto-generado ("Certamen 1", etc.)

### Notas
- Pagina `/grades` con cards expandibles por ramo
- Promedio final = suma ponderada de promedios por categoria
- Cada categoria tiene peso %, cada evaluacion puede tener peso % dentro de su categoria

### Dashboard
- Metricas: ramos inscritos, evaluaciones totales, proximas evaluaciones
- Panel de eventos proximos con filtros
