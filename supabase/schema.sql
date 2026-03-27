-- ============================================================
-- UniSchedule - Schema completo para Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- 1. SUBJECTS (Ramos/Asignaturas)
-- ============================================================
CREATE TABLE subjects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  code        TEXT,
  professor   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subjects_user_id ON subjects(user_id);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own subjects"
  ON subjects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own subjects"
  ON subjects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own subjects"
  ON subjects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own subjects"
  ON subjects FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. SCHEDULES (Horarios por bloque)
-- ============================================================
CREATE TABLE schedules (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  day         SMALLINT NOT NULL CHECK (day BETWEEN 1 AND 5),
  block_key   TEXT NOT NULL,
  room        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, day, block_key)
);

CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_schedules_subject_id ON schedules(subject_id);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own schedules"
  ON schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own schedules"
  ON schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own schedules"
  ON schedules FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own schedules"
  ON schedules FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. EVALUATION CATEGORIES (Categorías de evaluación)
-- ============================================================
CREATE TABLE evaluation_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  weight      NUMERIC(5,2) NOT NULL,
  sort_order  SMALLINT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_eval_categories_subject ON evaluation_categories(subject_id);
CREATE INDEX idx_eval_categories_user ON evaluation_categories(user_id);

ALTER TABLE evaluation_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own categories"
  ON evaluation_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own categories"
  ON evaluation_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own categories"
  ON evaluation_categories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own categories"
  ON evaluation_categories FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. EVALUATIONS (Evaluaciones individuales)
-- ============================================================
CREATE TABLE evaluations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id    UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  category_id   UUID REFERENCES evaluation_categories(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('certamen', 'control', 'tarea', 'proyecto', 'otro')),
  eval_date     DATE,
  eval_time     TIME,
  room          TEXT,
  grade         NUMERIC(3,1) CHECK (grade IS NULL OR (grade >= 1.0 AND grade <= 7.0)),
  weight        NUMERIC(5,2),
  priority      TEXT DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baja')),
  pinned        BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_evaluations_subject ON evaluations(subject_id);
CREATE INDEX idx_evaluations_category ON evaluations(category_id);
CREATE INDEX idx_evaluations_user ON evaluations(user_id);
CREATE INDEX idx_evaluations_date ON evaluations(eval_date);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own evaluations"
  ON evaluations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own evaluations"
  ON evaluations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own evaluations"
  ON evaluations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- HELPER: Trigger para updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_subjects
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_evaluations
  BEFORE UPDATE ON evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
