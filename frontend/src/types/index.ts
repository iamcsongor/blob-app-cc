export type MetricCategory =
  | 'engagement_volume'
  | 'reaction_time'
  | 'participation'
  | 'presence_analysis'
  | 'sentiment_analysis'
  | 'social_brand_rep'

export type UserRole =
  | 'org_admin'
  | 'dept_manager'
  | 'team_lead'
  | 'executive_viewer'
  | 'read_only'

export interface Organisation {
  id: string
  name: string
  logo_url: string | null
  timezone: string
  currency: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  org_id: string
  name: string
  manager_id: string | null
  team_size: number
  description: string | null
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  org_id: string
  name: string
  email: string | null
  department_id: string | null
  role_title: string | null
  manager_id: string | null
  start_date: string | null
  status: 'active' | 'away' | 'on_leave' | 'offboarded'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface MetricScore {
  id: string
  employee_id: string
  org_id: string
  category: MetricCategory
  score: number
  confidence: number
  computed_at: string
  created_at: string
}

export interface BlobScore {
  id: string
  employee_id: string
  org_id: string
  score: number
  interpretation: string
  computed_at: string
  created_at: string
}

export interface Program {
  id: string
  org_id: string
  name: string
  description: string | null
  template_type: string
  status: 'active' | 'paused' | 'completed'
  duration_weeks: number | null
  created_at: string
  updated_at: string
  enrolment_count?: number
}

export interface ProgramEnrolment {
  id: string
  program_id: string
  employee_id: string
  org_id: string
  status: 'active' | 'completed' | 'dropped'
  enrolled_at: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Trophy {
  id: string
  org_id: string
  name: string
  description: string | null
  icon_url: string | null
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  criteria_type: 'manual' | 'automatic'
  criteria_config: Record<string, any> | null
  created_at: string
  award_count?: number
}

export interface TrophyAward {
  id: string
  trophy_id: string
  employee_id: string
  org_id: string
  awarded_at: string
  awarded_by: string | null
  created_at: string
}

export interface FeedEvent {
  id: string
  org_id: string
  event_type: string
  title: string
  description: string | null
  entity_type: string | null
  entity_id: string | null
  tags: string[]
  created_at: string
}

export interface ConnectedTool {
  id: string
  org_id: string
  tool_name: string
  status: 'connected' | 'disconnected' | 'error'
  employee_count: number
  last_sync_at: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  org_id: string
  type: 'critical' | 'warning' | 'positive' | 'informational' | 'ai_insight'
  title: string
  body: string | null
  entity_type: string | null
  entity_id: string | null
  read: boolean
  created_at: string
}

export interface WatchlistItem {
  id: string
  user_id: string
  entity_type: 'employee' | 'department'
  entity_id: string
  created_at: string
}

export interface CompanyEvent {
  id: string
  org_id: string
  name: string
  event_type: string | null
  event_date: string
  description: string | null
  created_at: string
}

export interface User {
  id: string
  org_id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface DashboardSummary {
  total_employees: number
  at_risk_count: number
  thriving_count: number
  average_score: number
  top_departments: Department[]
  recent_events: FeedEvent[]
}

export interface ScatterDataPoint {
  id: string
  name: string
  engagement: number
  sentiment: number
  risk_level: 'low' | 'medium' | 'high'
}

export interface TimelineDataPoint {
  date: string
  average_score: number
  at_risk: number
  thriving: number
}

export interface DepartmentTableRow {
  id: string
  name: string
  employee_count: number
  average_score: number
  at_risk_count: number
  trend: 'up' | 'down' | 'stable'
}
