-- ============================================================
-- UniSchedule - Datos de ejemplo (Seed Data)
--
-- IMPORTANTE: Reemplaza 'TU_USER_ID' con tu UUID real de
-- Supabase Auth. Puedes encontrarlo en:
-- Supabase Dashboard → Authentication → Users
-- ============================================================

-- Reemplaza este valor con tu user_id real
DO $$
DECLARE
  uid UUID := 'TU_USER_ID'; -- ← CAMBIAR ESTO
BEGIN

-- ============================================================
-- RAMOS
-- ============================================================
INSERT INTO subjects (id, user_id, name, code, professor) VALUES
  ('a1111111-1111-1111-1111-111111111111', uid, 'Cálculo I', 'MAT101', 'Dr. Alejandro Pérez'),
  ('a2222222-2222-2222-2222-222222222222', uid, 'Programación', 'INF120', 'Dra. María López'),
  ('a3333333-3333-3333-3333-333333333333', uid, 'Física General', 'FIS110', 'Dr. Carlos Muñoz'),
  ('a4444444-4444-4444-4444-444444444444', uid, 'Álgebra Lineal', 'MAT201', 'Dra. Sofía Ramírez'),
  ('a5555555-5555-5555-5555-555555555555', uid, 'Inglés Técnico', 'ING100', 'Prof. John Smith');

-- ============================================================
-- HORARIOS
-- ============================================================
INSERT INTO schedules (user_id, subject_id, day, block_key, room) VALUES
  -- Cálculo I: Lunes y Miércoles bloques 1-2
  (uid, 'a1111111-1111-1111-1111-111111111111', 1, '1-2', 'A-101'),
  (uid, 'a1111111-1111-1111-1111-111111111111', 3, '1-2', 'A-101'),
  -- Programación: Martes y Jueves bloques 3-4
  (uid, 'a2222222-2222-2222-2222-222222222222', 2, '3-4', 'Lab-3'),
  (uid, 'a2222222-2222-2222-2222-222222222222', 4, '3-4', 'Lab-3'),
  -- Física: Lunes bloques 5-6, Miércoles bloques 3-4
  (uid, 'a3333333-3333-3333-3333-333333333333', 1, '5-6', 'B-201'),
  (uid, 'a3333333-3333-3333-3333-333333333333', 3, '3-4', 'B-201'),
  -- Álgebra: Martes y Viernes bloques 1-2
  (uid, 'a4444444-4444-4444-4444-444444444444', 2, '1-2', 'A-305'),
  (uid, 'a4444444-4444-4444-4444-444444444444', 5, '1-2', 'A-305'),
  -- Inglés: Jueves bloques 9-10
  (uid, 'a5555555-5555-5555-5555-555555555555', 4, '9-10', 'C-102');

-- ============================================================
-- CATEGORÍAS DE EVALUACIÓN
-- ============================================================
-- Cálculo I
INSERT INTO evaluation_categories (id, user_id, subject_id, name, weight, sort_order) VALUES
  ('c1111111-1111-1111-1111-111111111111', uid, 'a1111111-1111-1111-1111-111111111111', 'Certámenes', 70, 1),
  ('c1111111-1111-1111-1111-222222222222', uid, 'a1111111-1111-1111-1111-111111111111', 'Controles', 20, 2),
  ('c1111111-1111-1111-1111-333333333333', uid, 'a1111111-1111-1111-1111-111111111111', 'Tareas', 10, 3);

-- Programación
INSERT INTO evaluation_categories (id, user_id, subject_id, name, weight, sort_order) VALUES
  ('c2222222-2222-2222-2222-111111111111', uid, 'a2222222-2222-2222-2222-222222222222', 'Certámenes', 50, 1),
  ('c2222222-2222-2222-2222-222222222222', uid, 'a2222222-2222-2222-2222-222222222222', 'Proyectos', 30, 2),
  ('c2222222-2222-2222-2222-333333333333', uid, 'a2222222-2222-2222-2222-222222222222', 'Laboratorios', 20, 3);

-- Física
INSERT INTO evaluation_categories (id, user_id, subject_id, name, weight, sort_order) VALUES
  ('c3333333-3333-3333-3333-111111111111', uid, 'a3333333-3333-3333-3333-333333333333', 'Certámenes', 80, 1),
  ('c3333333-3333-3333-3333-222222222222', uid, 'a3333333-3333-3333-3333-333333333333', 'Controles', 20, 2);

-- ============================================================
-- EVALUACIONES
-- ============================================================
-- Cálculo I
INSERT INTO evaluations (user_id, subject_id, category_id, name, type, eval_date, eval_time, room, grade, priority, pinned) VALUES
  (uid, 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Certamen 1', 'certamen', '2026-04-15', '10:00', 'Gym', 5.5, 'alta', true),
  (uid, 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Certamen 2', 'certamen', '2026-05-20', '10:00', 'Gym', NULL, 'alta', false),
  (uid, 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-222222222222', 'Control 1', 'control', '2026-04-01', '08:15', 'A-101', 6.0, 'media', false),
  (uid, 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-222222222222', 'Control 2', 'control', '2026-04-22', '08:15', 'A-101', NULL, 'media', false),
  (uid, 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-333333333333', 'Tarea 1', 'tarea', '2026-04-08', NULL, NULL, 6.5, 'baja', false);

-- Programación
INSERT INTO evaluations (user_id, subject_id, category_id, name, type, eval_date, eval_time, room, grade, priority, pinned) VALUES
  (uid, 'a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-111111111111', 'Certamen 1', 'certamen', '2026-04-10', '14:40', 'Gym', 4.8, 'alta', true),
  (uid, 'a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Proyecto Web', 'proyecto', '2026-05-15', NULL, NULL, NULL, 'alta', true),
  (uid, 'a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-333333333333', 'Lab 1', 'tarea', '2026-03-28', '14:40', 'Lab-3', 6.2, 'media', false),
  (uid, 'a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-333333333333', 'Lab 2', 'tarea', '2026-04-18', '14:40', 'Lab-3', NULL, 'media', false);

-- Física
INSERT INTO evaluations (user_id, subject_id, category_id, name, type, eval_date, eval_time, room, grade, priority, pinned) VALUES
  (uid, 'a3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-111111111111', 'Certamen 1', 'certamen', '2026-04-12', '09:40', 'Gym', NULL, 'alta', false),
  (uid, 'a3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-222222222222', 'Control 1', 'control', '2026-04-05', '11:05', 'B-201', 5.0, 'media', false);

END $$;
