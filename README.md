<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS 4" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github&logoColor=white" alt="GitHub Pages" />
</p>

<h1 align="center">UniSchedule</h1>

<p align="center">
  <strong>Organiza tu vida universitaria</strong><br/>
  Gestiona ramos, horarios, evaluaciones y promedios desde una sola app.
</p>

<p align="center">
  <a href="https://craulii.github.io/UniSchedule/">Ver Demo en Vivo</a>
</p>

---

## Tabla de Contenidos

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Instalacion y Desarrollo Local](#instalacion-y-desarrollo-local)
- [Configuracion de Supabase](#configuracion-de-supabase)
- [Deploy en GitHub Pages](#deploy-en-github-pages)
- [Sistema de Bloques Horarios](#sistema-de-bloques-horarios)
- [Sistema de Calculo de Promedios](#sistema-de-calculo-de-promedios)
- [Topes Horarios](#topes-horarios)
- [Seed Data](#seed-data)
- [Variables de Entorno](#variables-de-entorno)
- [Licencia](#licencia)

---

## Sobre el Proyecto

**UniSchedule** es una aplicacion web pensada para estudiantes universitarios chilenos que necesitan organizar sus ramos, definir su horario semanal por bloques, registrar evaluaciones y calcular sus promedios de forma flexible.

La app funciona 100% como frontend estatico (sin backend propio), usando **Supabase** como base de datos y sistema de autenticacion. Esto permite desplegarla gratuitamente en **GitHub Pages**.

### Problema que resuelve

Los estudiantes universitarios manejan multiples ramos, horarios complejos con bloques fijos, docenas de evaluaciones con distintas ponderaciones, y necesitan calcular promedios que varian por asignatura. UniSchedule centraliza todo esto en una interfaz moderna y rapida.

---

## Capturas de Pantalla

| Dashboard | Horario Semanal |
|:-:|:-:|
| Vista general con metricas y eventos proximos | Grilla semanal con bloques, almuerzo y topes |

| Gestion de Ramos | Evaluaciones y Notas |
|:-:|:-:|
| CRUD completo con codigos y profesores | Categorias ponderadas con calculo automatico |

---

## Funcionalidades

### Autenticacion
- Registro e inicio de sesion con email/password via Supabase Auth
- Persistencia de sesion (se mantiene logueado entre recargas)
- Rutas protegidas: sin login no se accede a la app

### Gestion de Ramos
- Crear, editar y eliminar asignaturas
- Cada ramo tiene: nombre, codigo (opcional) y profesor (opcional)
- Colores automaticos por ramo (paleta de 12 colores)

### Horario Semanal por Bloques
- Grilla visual: filas = bloques horarios, columnas = dias (Lunes a Viernes)
- 8 bloques asignables + 1 bloque de almuerzo (no asignable, visualmente distinto)
- El usuario NO ingresa horas manualmente, solo selecciona bloques
- Soporte para **topes horarios**: dos ramos en el mismo bloque se muestran divididos 50/50 con alerta visual
- Cada asignacion puede incluir sala

### Evaluaciones
- Crear evaluaciones con: nombre, tipo, fecha, hora, sala, nota, peso, prioridad
- Tipos: Certamen, Control, Tarea, Proyecto, Otro
- Prioridades: Alta, Media, Baja (con badges de color)
- Fijar/desfijar evaluaciones (pin)

### Calculo de Promedios
- Categorias configurables por ramo (ej: Certamenes 70%, Controles 20%, Tareas 10%)
- Pesos editables por evaluacion dentro de cada categoria
- Promedio por categoria (ponderado o igualitario)
- Promedio final del ramo = suma ponderada de categorias
- Feedback visual cuando las ponderaciones no suman 100%
- Escala chilena: notas de 1.0 a 7.0

### Panel de Eventos Proximos
- Lista de evaluaciones futuras ordenadas por fecha
- Indicador de urgencia (Hoy, Manana, En X dias)
- Filtros: por ramo, por tipo, solo fijados
- Eventos fijados aparecen primero

---

## Stack Tecnologico

| Tecnologia | Uso | Version |
|---|---|---|
| **React** | UI / Componentes | 19.x |
| **Vite** | Build tool / Dev server | 6.x |
| **TailwindCSS** | Estilos utility-first | 4.x |
| **Supabase** | Base de datos (PostgreSQL) + Auth | 2.x |
| **Zustand** | State management | 5.x |
| **React Router** | Routing (HashRouter) | 7.x |
| **GitHub Pages** | Hosting estatico | - |
| **GitHub Actions** | CI/CD deploy automatico | - |

### Por que estas tecnologias?

- **Vite + React**: Build rapido, HMR instantaneo, ecosistema maduro
- **TailwindCSS v4**: Sin configuracion de contenido, CSS moderno, bundle pequeno
- **Supabase**: PostgreSQL completo con RLS, auth integrada, tier gratuito generoso
- **Zustand**: Estado global minimalista sin boilerplate (vs Redux)
- **HashRouter**: Compatibilidad nativa con GitHub Pages sin configuracion de servidor

---

## Arquitectura

```
Usuario (Browser)
    |
    v
[React SPA - GitHub Pages]
    |
    |-- Zustand Stores (estado local + cache)
    |       |
    |       v
    |   [Supabase Client JS]
    |       |
    v       v
[Supabase]
    |-- Auth (email/password, sesiones JWT)
    |-- PostgreSQL (datos con RLS)
    |-- Row Level Security (cada usuario solo ve sus datos)
```

### Patron de Stores

Cada dominio tiene su propio Zustand store con el mismo patron:

```
Estado:    items[], loading, error
Acciones:  fetch(), create(), update(), remove()
Patron:    Optimistic updates con rollback en error
```

### Calculo de Notas

Las funciones de calculo viven en `lib/gradeCalculator.js` como funciones puras (sin side effects). El hook `useGrades` las invoca con datos de los stores.

---

## Estructura del Proyecto

```
UniSchedule/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: build + deploy a GitHub Pages
├── public/
│   └── 404.html                    # SPA redirect para GitHub Pages
├── supabase/
│   ├── schema.sql                  # Schema completo (4 tablas + RLS + triggers)
│   └── seed.sql                    # Datos de ejemplo
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # HashRouter + definicion de rutas
│   ├── index.css                   # Tailwind directives
│   │
│   ├── lib/                        # Utilidades y servicios
│   │   ├── supabase.js             # Cliente Supabase singleton
│   │   ├── gradeCalculator.js      # Funciones puras de calculo de notas
│   │   └── subjectColors.js        # Paleta de colores por ramo
│   │
│   ├── constants/                  # Valores constantes
│   │   ├── blocks.js               # Bloques horarios (horarios fijos)
│   │   ├── evaluationTypes.js      # Tipos de evaluacion
│   │   └── priorities.js           # Niveles de prioridad
│   │
│   ├── stores/                     # Estado global (Zustand)
│   │   ├── authStore.js            # Autenticacion y sesion
│   │   ├── subjectStore.js         # CRUD de ramos
│   │   ├── scheduleStore.js        # CRUD de horarios
│   │   ├── categoryStore.js        # CRUD de categorias de evaluacion
│   │   └── evaluationStore.js      # CRUD de evaluaciones
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useGrades.js            # Calculo de promedios por ramo
│   │   └── useUpcoming.js          # Eventos proximos filtrados
│   │
│   ├── components/
│   │   ├── layout/                 # Layout general
│   │   │   ├── AppLayout.jsx       # Sidebar + contenido
│   │   │   ├── Sidebar.jsx         # Navegacion lateral
│   │   │   └── ProtectedRoute.jsx  # Guard de autenticacion
│   │   │
│   │   ├── ui/                     # Componentes UI reutilizables
│   │   │   ├── Button.jsx          # Boton con variantes y loading
│   │   │   ├── Input.jsx           # Input con label y error
│   │   │   ├── Select.jsx          # Select con opciones
│   │   │   ├── Modal.jsx           # Dialog modal
│   │   │   ├── Badge.jsx           # Badge de color
│   │   │   ├── Card.jsx            # Tarjeta contenedora
│   │   │   ├── EmptyState.jsx      # Estado vacio
│   │   │   └── WeightIndicator.jsx # Barra de ponderacion
│   │   │
│   │   ├── subjects/               # Componentes de ramos
│   │   ├── schedule/               # Grilla horaria
│   │   ├── evaluations/            # Lista y formularios de evaluaciones
│   │   ├── grades/                 # Panel de notas y promedios
│   │   └── upcoming/               # Eventos proximos
│   │
│   └── pages/                      # Paginas (una por ruta)
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       ├── DashboardPage.jsx
│       ├── SubjectsPage.jsx
│       ├── SubjectDetailPage.jsx
│       ├── SchedulePage.jsx
│       └── NotFoundPage.jsx
│
├── .env.example                    # Template de variables de entorno
├── vite.config.js                  # Configuracion de Vite + Tailwind
├── package.json
└── README.md
```

---

## Base de Datos

### Diagrama de Relaciones

```
auth.users (Supabase Auth)
    |
    |-- 1:N --> subjects
    |               |
    |               |-- 1:N --> schedules
    |               |
    |               |-- 1:N --> evaluation_categories
    |               |               |
    |               |               |-- 1:N --> evaluations
    |               |
    |               |-- 1:N --> evaluations (directa)
```

### Tablas

#### `subjects` - Ramos/Asignaturas
| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | UUID (PK) | Identificador unico |
| `user_id` | UUID (FK) | Referencia a auth.users |
| `name` | TEXT | Nombre del ramo |
| `code` | TEXT | Codigo (ej: MAT101), opcional |
| `professor` | TEXT | Nombre del profesor, opcional |
| `created_at` | TIMESTAMPTZ | Fecha de creacion |
| `updated_at` | TIMESTAMPTZ | Ultima modificacion (auto-trigger) |

#### `schedules` - Asignaciones de Horario
| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | UUID (PK) | Identificador unico |
| `user_id` | UUID (FK) | Referencia a auth.users |
| `subject_id` | UUID (FK) | Referencia a subjects (CASCADE) |
| `day` | SMALLINT | Dia de la semana (1=Lunes ... 5=Viernes) |
| `block_key` | TEXT | Clave del bloque (ej: '1-2', '3-4') |
| `room` | TEXT | Sala, opcional |

> Sin constraint UNIQUE: permite topes horarios (multiples ramos en el mismo bloque).

#### `evaluation_categories` - Categorias de Evaluacion
| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | UUID (PK) | Identificador unico |
| `user_id` | UUID (FK) | Referencia a auth.users |
| `subject_id` | UUID (FK) | Referencia a subjects (CASCADE) |
| `name` | TEXT | Nombre (ej: "Certamenes") |
| `weight` | NUMERIC(5,2) | Ponderacion en % del ramo |
| `sort_order` | SMALLINT | Orden de visualizacion |

#### `evaluations` - Evaluaciones Individuales
| Columna | Tipo | Descripcion |
|---|---|---|
| `id` | UUID (PK) | Identificador unico |
| `user_id` | UUID (FK) | Referencia a auth.users |
| `subject_id` | UUID (FK) | Referencia a subjects (CASCADE) |
| `category_id` | UUID (FK) | Referencia a evaluation_categories (SET NULL) |
| `name` | TEXT | Nombre de la evaluacion |
| `type` | TEXT | certamen / control / tarea / proyecto / otro |
| `eval_date` | DATE | Fecha de la evaluacion |
| `eval_time` | TIME | Hora |
| `room` | TEXT | Sala |
| `grade` | NUMERIC(3,1) | Nota (1.0 - 7.0), CHECK constraint |
| `weight` | NUMERIC(5,2) | Peso dentro de la categoria (%) |
| `priority` | TEXT | alta / media / baja |
| `pinned` | BOOLEAN | Si esta fijado/destacado |

### Row Level Security (RLS)

Cada tabla tiene 4 policies que garantizan que un usuario solo puede ver, crear, editar y eliminar **sus propios datos**:

```sql
CREATE POLICY "Users see own [table]"
  ON [table] FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Instalacion y Desarrollo Local

### Prerequisitos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9
- Una cuenta en [Supabase](https://supabase.com/) (tier gratuito)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/craulii/UniSchedule.git
cd UniSchedule

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase (ver seccion siguiente)

# 4. Iniciar servidor de desarrollo
npm run dev
```

La app estara disponible en `http://localhost:5173/UniSchedule/`

### Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo con HMR |
| `npm run build` | Genera build de produccion en `dist/` |
| `npm run preview` | Preview del build de produccion |
| `npm run lint` | Ejecuta ESLint |

---

## Configuracion de Supabase

### 1. Crear proyecto

1. Ve a [supabase.com](https://supabase.com/) y crea un nuevo proyecto
2. Selecciona la region mas cercana (ej: `sa-east-1` para Sudamerica)
3. Anota la **URL del proyecto** y la **anon key** (Settings > API)

### 2. Ejecutar schema

1. Ve a **SQL Editor** en el dashboard de Supabase
2. Pega el contenido completo de `supabase/schema.sql`
3. Ejecuta el query

Esto creara las 4 tablas, indices, politicas RLS y triggers automaticamente.

### 3. Configurar autenticacion

En **Authentication > Settings**:
- **Email Auth**: habilitado
- **Confirm email**: desactivado (o activado si prefieres verificacion)

### 4. (Opcional) Cargar datos de ejemplo

1. Registrate en la app para obtener tu `user_id`
2. Edita `supabase/seed.sql` reemplazando `'TU_USER_ID'` con tu UUID real
3. Ejecuta el seed en SQL Editor

---

## Deploy en GitHub Pages

### Deploy automatico (recomendado)

El repositorio incluye un workflow de GitHub Actions (`.github/workflows/deploy.yml`) que automaticamente:

1. Hace build del proyecto al pushear a `master` o `main`
2. Inyecta las variables de Supabase desde GitHub Secrets
3. Despliega el contenido de `dist/` a GitHub Pages

### Configuracion paso a paso

1. **Agregar secrets** en el repositorio:
   - Ve a Settings > Secrets and variables > Actions
   - Agrega:
     - `VITE_SUPABASE_URL` = `https://tu-proyecto.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = tu anon key

2. **Habilitar GitHub Pages**:
   - Ve a Settings > Pages
   - Source: **GitHub Actions**

3. **Push a master/main** para disparar el deploy

La app quedara en: `https://tu-usuario.github.io/UniSchedule/`

### Deploy manual

```bash
npm run build
# Subir contenido de dist/ a cualquier hosting estatico
```

### Nota sobre routing

Se usa **HashRouter** (`/#/ruta`) para compatibilidad total con hosting estatico. No se requiere configuracion de servidor para manejar rutas.

---

## Sistema de Bloques Horarios

Los bloques horarios son fijos y predefinidos. El usuario **no ingresa horas manualmente**, solo selecciona en que bloque y dia tiene cada ramo.

| Bloque | Hora Inicio | Hora Fin | Asignable |
|---|---|---|---|
| 1-2 | 08:15 | 09:25 | Si |
| 3-4 | 09:40 | 10:50 | Si |
| 5-6 | 11:05 | 12:15 | Si |
| 7-8 | 12:30 | 13:40 | Si |
| **Almuerzo** | **13:40** | **14:40** | **No** |
| 9-10 | 14:40 | 15:50 | Si |
| 11-12 | 16:05 | 17:15 | Si |
| 13-14 | 17:30 | 18:40 | Si |
| 15-16 | 18:55 | 20:04 | Si |

El bloque de almuerzo se muestra con estilo diferenciado y no permite asignar ramos.

---

## Sistema de Calculo de Promedios

### Estructura

```
Ramo
├── Categoria 1 (ej: Certamenes, peso: 70%)
│   ├── Evaluacion 1 (nota: 5.5, peso: 60%)
│   └── Evaluacion 2 (nota: 6.0, peso: 40%)
├── Categoria 2 (ej: Controles, peso: 20%)
│   ├── Evaluacion 1 (nota: 4.0)
│   └── Evaluacion 2 (nota: 5.0)
└── Categoria 3 (ej: Tareas, peso: 10%)
    └── Evaluacion 1 (nota: 6.5)
```

### Algoritmo de calculo

```
1. Promedio por categoria:
   - Si las evaluaciones tienen pesos explicitos:
     promedio = sum(nota_i * peso_i) / sum(peso_i)
   - Si no tienen pesos (o todos son null):
     promedio = sum(notas) / cantidad

2. Promedio final del ramo:
   promedio_final = sum(promedio_categoria_i * peso_categoria_i) / sum(pesos_categorias)
```

### Ejemplo concreto

| Categoria | Peso | Evaluaciones | Promedio Categoria |
|---|---|---|---|
| Certamenes | 70% | C1=5.5 (60%), C2=6.0 (40%) | 5.5*0.6 + 6.0*0.4 = **5.70** |
| Controles | 20% | C1=4.0, C2=5.0 (iguales) | (4.0 + 5.0) / 2 = **4.50** |
| Tareas | 10% | T1=6.5 | **6.50** |

**Promedio final** = 5.70 * 0.70 + 4.50 * 0.20 + 6.50 * 0.10 = 3.99 + 0.90 + 0.65 = **5.54**

### Validaciones visuales

- Barra de progreso que muestra si las ponderaciones suman 100%
- Color verde si es valido, amarillo si falta, rojo si excede
- Las notas se colorean: verde >= 4.0 (aprobado), rojo < 4.0 (reprobado)

---

## Topes Horarios

UniSchedule permite **topes horarios**: asignar dos o mas ramos al mismo bloque horario.

### Comportamiento

- Al intentar asignar un ramo a un bloque ya ocupado, el modal muestra una advertencia con los ramos existentes
- El usuario confirma explicitamente con el boton "Asignar con tope"
- No se permite asignar el mismo ramo dos veces al mismo bloque
- La celda con tope muestra:
  - Borde rojo
  - Banner "TOPE" en la parte superior
  - Ambos ramos divididos 50/50 horizontalmente

---

## Seed Data

El archivo `supabase/seed.sql` incluye datos de ejemplo para probar la aplicacion:

- **5 ramos**: Calculo I, Programacion, Fisica General, Algebra Lineal, Ingles Tecnico
- **9 asignaciones de horario** distribuidas en la semana
- **3 conjuntos de categorias** con ponderaciones realistas
- **11 evaluaciones** con notas, fechas y prioridades variadas

Para usarlo, reemplaza `'TU_USER_ID'` en el archivo con tu UUID real de Supabase Auth.

---

## Variables de Entorno

| Variable | Descripcion | Donde obtenerla |
|---|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | Dashboard > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Clave publica (anon) | Dashboard > Settings > API |

> La `anon key` es segura para exponer en el frontend. La seguridad de los datos la provee Row Level Security (RLS) en la base de datos.

---

## Licencia

Este proyecto es de uso libre para fines educativos.

---

<p align="center">
  Hecho con React + Supabase para estudiantes universitarios
</p>
