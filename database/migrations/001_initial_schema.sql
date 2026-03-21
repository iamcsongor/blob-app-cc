-- Blob Initial Schema Migration
-- AI-powered early-warning system for employee productivity/burnout
-- Multi-tenant architecture with Row-Level Security (RLS)
-- Created: 2026-03-21

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================================
-- TRIGGER FUNCTIONS (non-table-dependent only)
-- ============================================================================

-- Auto-update updated_at timestamp on any UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. ORGANISATIONS
-- Top-level tenant entity; all other entities are scoped to an org
CREATE TABLE public.organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  timezone TEXT DEFAULT 'UTC' NOT NULL,
  currency TEXT DEFAULT 'GBP' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- 2. USERS
-- Application users linked to Supabase auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('org_admin', 'dept_manager', 'team_lead', 'executive_viewer', 'read_only')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- 3. DEPARTMENTS
-- Organisational structure within an org
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(org_id, name)
);


-- 4. EMPLOYEES
-- Employee records with self-referential manager relationships
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  role_title TEXT,
  manager_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  start_date DATE,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'away', 'on_leave', 'offboarded')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- 5. BLOB_SCORES
-- AI-computed overall productivity/burnout score per employee
CREATE TABLE public.blob_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  score NUMERIC(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
  grade TEXT NOT NULL,
  confidence NUMERIC(3, 2) DEFAULT 1.0 NOT NULL CHECK (confidence >= 0 AND confidence <= 1.0),
  computed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: blob_scores is append-only; no updated_at trigger needed


-- 6. METRIC_SCORES
-- Individual metric components that feed into blob_score
CREATE TABLE public.metric_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (
    category IN (
      'engagement_volume',
      'reaction_time',
      'participation',
      'presence_analysis',
      'sentiment_analysis',
      'social_brand_rep'
    )
  ),
  value NUMERIC(5, 2) NOT NULL CHECK (value >= 0 AND value <= 100),
  trend NUMERIC(5, 2),
  computed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: metric_scores is append-only; no updated_at trigger needed


-- 7. PROGRAMS
-- Intervention/engagement programs targeting at-risk employees
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT CHECK (
    template_type IN (
      'reengagement_sprint',
      'burnout_recovery',
      'onboarding_boost',
      'skills_stretch',
      'transition_support',
      'custom'
    )
  ),
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'paused', 'completed')),
  duration_weeks INT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- 8. PROGRAM_MILESTONES
-- Structured checkpoints within a program
CREATE TABLE public.program_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  milestone_type TEXT CHECK (milestone_type IN ('automatic', 'manual', 'scheduled')),
  sort_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: milestones are mostly immutable; no updated_at trigger needed


-- 9. PROGRAM_ENROLMENTS
-- Employee enrollment in programs with progress tracking
CREATE TABLE public.program_enrolments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  enrolled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'paused', 'completed', 'dropped')),
  progress NUMERIC(5, 2) DEFAULT 0 NOT NULL CHECK (progress >= 0 AND progress <= 100),
  score_at_enrolment NUMERIC(5, 2),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(program_id, employee_id)
);


-- 10. MILESTONE_COMPLETIONS
-- Tracks when an enroled employee completes a program milestone
CREATE TABLE public.milestone_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES public.program_milestones(id) ON DELETE CASCADE,
  enrolment_id UUID NOT NULL REFERENCES public.program_enrolments(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: append-only; no updated_at trigger needed


-- 11. TROPHIES
-- Achievement/gamification trophies
CREATE TABLE public.trophies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  rarity TEXT DEFAULT 'common' NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  criteria_type TEXT DEFAULT 'manual' NOT NULL CHECK (criteria_type IN ('manual', 'automatic')),
  criteria_config JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: mostly immutable; no updated_at trigger needed


-- 12. TROPHY_AWARDS
-- Individual trophy awards to employees
CREATE TABLE public.trophy_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trophy_id UUID NOT NULL REFERENCES public.trophies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  awarded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reason TEXT,
  awarded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: append-only; no updated_at trigger needed


-- 13. FEED_EVENTS
-- Activity feed showing org-wide events (scores, alerts, program events, etc.)
CREATE TABLE public.feed_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'score_change',
      'risk_alert',
      'program_event',
      'trophy_award',
      'integration_event',
      'system_event',
      'ai_inference'
    )
  ),
  title TEXT NOT NULL,
  description TEXT,
  entity_type TEXT,
  entity_id UUID,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: append-only; no updated_at trigger needed


-- 14. CONNECTED_TOOLS
-- Integration status for external tools (Slack, Teams, Google, etc.)
CREATE TABLE public.connected_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL CHECK (
    tool_name IN (
      'slack',
      'microsoft_teams',
      'google_workspace',
      'zoom',
      'outlook',
      'salesforce',
      'hubspot',
      'github',
      'workday',
      'chatgpt'
    )
  ),
  status TEXT DEFAULT 'disconnected' NOT NULL CHECK (status IN ('connected', 'disconnected', 'error')),
  oauth_tokens_encrypted TEXT,
  last_sync_at TIMESTAMPTZ,
  employee_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(org_id, tool_name)
);


-- 15. NOTIFICATIONS
-- User-level notifications (alerts, insights, etc.)
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'positive', 'informational', 'ai_insight')),
  title TEXT NOT NULL,
  body TEXT,
  entity_type TEXT,
  entity_id UUID,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: append-only; no updated_at trigger needed


-- 16. WATCHLIST_ITEMS
-- User's personal watchlist of employees/departments
CREATE TABLE public.watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('employee', 'department')),
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, entity_type, entity_id)
);

-- Note: mostly immutable; no updated_at trigger needed


-- 17. COMPANY_EVENTS
-- Org-wide events (holidays, offsite dates, etc.) for contextual analysis
CREATE TABLE public.company_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_type TEXT,
  event_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Note: mostly immutable; no updated_at trigger needed


-- 18. RAW_SIGNALS
-- Raw signal data from integrated tools (append-only, high-volume)
-- Partition hint: Consider partitioning by org_id and/or time for large deployments
CREATE TABLE public.raw_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  value JSONB,
  recorded_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Partition hint: For high-volume environments, consider:
-- PARTITION BY RANGE (DATE_TRUNC('month', recorded_at))
-- or PARTITION BY HASH (org_id) for better distribution

-- Note: append-only; no updated_at trigger needed


-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_organisations_created_at ON public.organisations(created_at);

CREATE INDEX idx_users_org_id ON public.users(org_id);
CREATE INDEX idx_users_email ON public.users(email);

CREATE INDEX idx_departments_org_id ON public.departments(org_id);
CREATE INDEX idx_departments_manager_id ON public.departments(manager_id);

CREATE INDEX idx_employees_org_id ON public.employees(org_id);
CREATE INDEX idx_employees_department_id ON public.employees(department_id);
CREATE INDEX idx_employees_manager_id ON public.employees(manager_id);
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_status ON public.employees(status);

CREATE INDEX idx_blob_scores_employee_computed ON public.blob_scores(employee_id, computed_at DESC);
CREATE INDEX idx_blob_scores_org_computed ON public.blob_scores(org_id, computed_at DESC);

CREATE INDEX idx_metric_scores_employee_category_computed
  ON public.metric_scores(employee_id, category, computed_at DESC);
CREATE INDEX idx_metric_scores_org_computed
  ON public.metric_scores(org_id, computed_at DESC);

CREATE INDEX idx_programs_org_id ON public.programs(org_id);
CREATE INDEX idx_programs_status ON public.programs(status);

CREATE INDEX idx_program_milestones_program_id ON public.program_milestones(program_id);
CREATE INDEX idx_program_milestones_sort_order ON public.program_milestones(program_id, sort_order);

CREATE INDEX idx_program_enrolments_program_id ON public.program_enrolments(program_id);
CREATE INDEX idx_program_enrolments_employee_id ON public.program_enrolments(employee_id);
CREATE INDEX idx_program_enrolments_org_id ON public.program_enrolments(org_id);
CREATE INDEX idx_program_enrolments_status ON public.program_enrolments(status);

CREATE INDEX idx_milestone_completions_enrolment_id ON public.milestone_completions(enrolment_id);
CREATE INDEX idx_milestone_completions_milestone_id ON public.milestone_completions(milestone_id);
CREATE INDEX idx_milestone_completions_completed_at ON public.milestone_completions(completed_at DESC);

CREATE INDEX idx_trophies_org_id ON public.trophies(org_id);
CREATE INDEX idx_trophies_criteria_type ON public.trophies(criteria_type);

CREATE INDEX idx_trophy_awards_employee_id ON public.trophy_awards(employee_id);
CREATE INDEX idx_trophy_awards_trophy_id ON public.trophy_awards(trophy_id);
CREATE INDEX idx_trophy_awards_org_id ON public.trophy_awards(org_id);
CREATE INDEX idx_trophy_awards_awarded_at ON public.trophy_awards(awarded_at DESC);

CREATE INDEX idx_feed_events_org_created ON public.feed_events(org_id, created_at DESC);
CREATE INDEX idx_feed_events_event_type ON public.feed_events(event_type);
CREATE INDEX idx_feed_events_entity ON public.feed_events(entity_type, entity_id);

CREATE INDEX idx_connected_tools_org_id ON public.connected_tools(org_id);
CREATE INDEX idx_connected_tools_status ON public.connected_tools(status);
CREATE INDEX idx_connected_tools_last_sync ON public.connected_tools(last_sync_at DESC);

CREATE INDEX idx_notifications_user_read_created
  ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_org_id ON public.notifications(org_id);

CREATE INDEX idx_watchlist_items_user_id ON public.watchlist_items(user_id);
CREATE INDEX idx_watchlist_items_entity ON public.watchlist_items(entity_type, entity_id);

CREATE INDEX idx_company_events_org_id ON public.company_events(org_id);
CREATE INDEX idx_company_events_date ON public.company_events(event_date);

CREATE INDEX idx_raw_signals_employee_source_recorded
  ON public.raw_signals(employee_id, source, recorded_at DESC);
CREATE INDEX idx_raw_signals_org_recorded
  ON public.raw_signals(org_id, recorded_at DESC);


-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blob_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trophies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trophy_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_signals ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update organisations.updated_at
CREATE TRIGGER trigger_organisations_updated_at
  BEFORE UPDATE ON public.organisations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update users.updated_at
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update departments.updated_at
CREATE TRIGGER trigger_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update employees.updated_at
CREATE TRIGGER trigger_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update programs.updated_at
CREATE TRIGGER trigger_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update program_enrolments.updated_at
CREATE TRIGGER trigger_program_enrolments_updated_at
  BEFORE UPDATE ON public.program_enrolments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update connected_tools.updated_at
CREATE TRIGGER trigger_connected_tools_updated_at
  BEFORE UPDATE ON public.connected_tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- HELPER FUNCTIONS (now safe because tables exist)
-- ============================================================================

-- Get the organisation ID for the current authenticated user
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE;


-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- ORGANISATIONS
-- Org admins (and higher) can see their org
CREATE POLICY organisations_read
  ON public.organisations
  FOR SELECT
  USING (
    id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY organisations_update
  ON public.organisations
  FOR UPDATE
  USING (
    id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  )
  WITH CHECK (
    id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- USERS
-- Users can see other users in their org
CREATE POLICY users_read
  ON public.users
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can update their own record; org_admins can update anyone in the org
CREATE POLICY users_update
  ON public.users
  FOR UPDATE
  USING (
    id = auth.uid() OR
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  )
  WITH CHECK (
    id = auth.uid() OR
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- DEPARTMENTS
-- Users can see departments in their org
CREATE POLICY departments_read
  ON public.departments
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin can manage departments
CREATE POLICY departments_insert
  ON public.departments
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );

CREATE POLICY departments_update
  ON public.departments
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );

CREATE POLICY departments_delete
  ON public.departments
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- EMPLOYEES
-- Users can see employees in their org
CREATE POLICY employees_read
  ON public.employees
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin and dept_manager can create/update employees
CREATE POLICY employees_insert
  ON public.employees
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );

CREATE POLICY employees_update
  ON public.employees
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager', 'team_lead')
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager', 'team_lead')
    )
  );

CREATE POLICY employees_delete
  ON public.employees
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- BLOB_SCORES
-- Users can see scores for employees in their org
CREATE POLICY blob_scores_read
  ON public.blob_scores
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin, dept_manager can insert scores
CREATE POLICY blob_scores_insert
  ON public.blob_scores
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );


-- METRIC_SCORES
-- Users can see metric scores for employees in their org
CREATE POLICY metric_scores_read
  ON public.metric_scores
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin, dept_manager can insert metric scores
CREATE POLICY metric_scores_insert
  ON public.metric_scores
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );


-- PROGRAMS
-- Users can see programs in their org
CREATE POLICY programs_read
  ON public.programs
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin, dept_manager can manage programs
CREATE POLICY programs_insert
  ON public.programs
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );

CREATE POLICY programs_update
  ON public.programs
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );

CREATE POLICY programs_delete
  ON public.programs
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- PROGRAM_MILESTONES
-- Users can see milestones for programs in their org
CREATE POLICY program_milestones_read
  ON public.program_milestones
  FOR SELECT
  USING (
    program_id IN (
      SELECT id FROM public.programs
      WHERE org_id IN (
        SELECT org_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- org_admin, dept_manager can manage milestones
CREATE POLICY program_milestones_insert
  ON public.program_milestones
  FOR INSERT
  WITH CHECK (
    program_id IN (
      SELECT id FROM public.programs
      WHERE org_id IN (
        SELECT org_id FROM public.users
        WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
      )
    )
  );

CREATE POLICY program_milestones_update
  ON public.program_milestones
  FOR UPDATE
  USING (
    program_id IN (
      SELECT id FROM public.programs
      WHERE org_id IN (
        SELECT org_id FROM public.users
        WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
      )
    )
  )
  WITH CHECK (
    program_id IN (
      SELECT id FROM public.programs
      WHERE org_id IN (
        SELECT org_id FROM public.users
        WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
      )
    )
  );

CREATE POLICY program_milestones_delete
  ON public.program_milestones
  FOR DELETE
  USING (
    program_id IN (
      SELECT id FROM public.programs
      WHERE org_id IN (
        SELECT org_id FROM public.users
        WHERE id = auth.uid() AND role = 'org_admin'
      )
    )
  );


-- PROGRAM_ENROLMENTS
-- Users can see enrolments for programs in their org
CREATE POLICY program_enrolments_read
  ON public.program_enrolments
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin, dept_manager can manage enrolments
CREATE POLICY program_enrolments_insert
  ON public.program_enrolments
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );

CREATE POLICY program_enrolments_update
  ON public.program_enrolments
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager', 'team_lead')
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager', 'team_lead')
    )
  );

CREATE POLICY program_enrolments_delete
  ON public.program_enrolments
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- MILESTONE_COMPLETIONS
-- Users can see milestone completions for programs in their org
CREATE POLICY milestone_completions_read
  ON public.milestone_completions
  FOR SELECT
  USING (
    enrolment_id IN (
      SELECT id FROM public.program_enrolments
      WHERE org_id IN (
        SELECT org_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- org_admin, dept_manager, team_lead can record completions
CREATE POLICY milestone_completions_insert
  ON public.milestone_completions
  FOR INSERT
  WITH CHECK (
    enrolment_id IN (
      SELECT id FROM public.program_enrolments
      WHERE org_id IN (
        SELECT org_id FROM public.users
        WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager', 'team_lead')
      )
    )
  );


-- TROPHIES
-- Users can see trophies in their org
CREATE POLICY trophies_read
  ON public.trophies
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin can manage trophies
CREATE POLICY trophies_insert
  ON public.trophies
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );

CREATE POLICY trophies_update
  ON public.trophies
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );

CREATE POLICY trophies_delete
  ON public.trophies
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- TROPHY_AWARDS
-- Users can see trophy awards in their org
CREATE POLICY trophy_awards_read
  ON public.trophy_awards
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin, dept_manager, team_lead can award trophies
CREATE POLICY trophy_awards_insert
  ON public.trophy_awards
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager', 'team_lead')
    )
  );


-- FEED_EVENTS
-- Users can see feed events in their org
CREATE POLICY feed_events_read
  ON public.feed_events
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin, dept_manager can insert feed events
CREATE POLICY feed_events_insert
  ON public.feed_events
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );


-- CONNECTED_TOOLS
-- Users can see connected tools for their org
CREATE POLICY connected_tools_read
  ON public.connected_tools
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin can manage connected tools
CREATE POLICY connected_tools_insert
  ON public.connected_tools
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );

CREATE POLICY connected_tools_update
  ON public.connected_tools
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );

CREATE POLICY connected_tools_delete
  ON public.connected_tools
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- NOTIFICATIONS
-- Users can only see their own notifications
CREATE POLICY notifications_read
  ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (e.g., mark as read)
CREATE POLICY notifications_update
  ON public.notifications
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- org_admin can insert notifications for users in their org
CREATE POLICY notifications_insert
  ON public.notifications
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- WATCHLIST_ITEMS
-- Users can see and manage only their own watchlist
CREATE POLICY watchlist_items_read
  ON public.watchlist_items
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY watchlist_items_insert
  ON public.watchlist_items
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY watchlist_items_delete
  ON public.watchlist_items
  FOR DELETE
  USING (user_id = auth.uid());


-- COMPANY_EVENTS
-- Users can see company events in their org
CREATE POLICY company_events_read
  ON public.company_events
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin can manage company events
CREATE POLICY company_events_insert
  ON public.company_events
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );

CREATE POLICY company_events_update
  ON public.company_events
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );

CREATE POLICY company_events_delete
  ON public.company_events
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role = 'org_admin'
    )
  );


-- RAW_SIGNALS
-- Users can see raw signals for employees in their org
CREATE POLICY raw_signals_read
  ON public.raw_signals
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.users WHERE id = auth.uid()
    )
  );

-- org_admin, dept_manager can insert raw signals
CREATE POLICY raw_signals_insert
  ON public.raw_signals
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM public.users
      WHERE id = auth.uid() AND role IN ('org_admin', 'dept_manager')
    )
  );


-- ============================================================================
-- COMMENTS & NOTES
-- ============================================================================

COMMENT ON TABLE public.organisations IS
  'Top-level tenant. All other entities are scoped to an organisation.';

COMMENT ON TABLE public.users IS
  'Application users, linked to Supabase auth.users. Each user belongs to one org.';

COMMENT ON TABLE public.employees IS
  'Employee records. Org_id enforces data isolation. Self-referential manager_id supports org hierarchies.';

COMMENT ON TABLE public.blob_scores IS
  'Computed Blob score (overall productivity/burnout indicator) per employee. Append-only; no updates.';

COMMENT ON TABLE public.metric_scores IS
  'Individual metric scores that compose blob_score. Categories: engagement, reaction time, participation, etc.';

COMMENT ON TABLE public.programs IS
  'Intervention programs (reengagement sprints, burnout recovery, etc.) targeting at-risk employees.';

COMMENT ON TABLE public.program_enrolments IS
  'Tracks employee enrollment in programs with progress and status.';

COMMENT ON TABLE public.raw_signals IS
  'High-volume append-only table storing raw signal data from integrated tools.
  Partition hint: Consider partitioning by org_id and/or recorded_at (monthly) for large deployments.';

COMMENT ON FUNCTION public.get_user_org_id() IS
  'Returns the org_id for the current authenticated user (auth.uid()).
  Used by RLS policies to scope data access.';

COMMENT ON FUNCTION public.update_updated_at_column() IS
  'Trigger function that auto-updates updated_at column on UPDATE events.
  Attached to tables with mutable data.';
