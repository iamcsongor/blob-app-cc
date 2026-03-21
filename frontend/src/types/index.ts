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
  logo_url?: string
  timezone: string
  currency: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  organisation_id: string
  name: string
  manager_id?: string
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  organisation_id: string
  department_id?: string
  email: string
  first_name: string
  last_name: string
  role?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MetricScore {
  id: string
  employee_id: string
  category: MetricCategory
  score: number
  timestamp: string
}

export interface BlobScore {
  id: string
  employee_id: string
  overall_score: number
  engagement_volume: number
  reaction_time: number
  participation: number
  presence_analysis: number
  sentiment_analysis: number
  social_brand_rep: number
  risk_level: 'low' | 'medium' | 'high'
  timestamp: string
}

export interface Program {
  id: string
  organisation_id: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  created_at: string
  updated_at: string
}

export interface ProgramEnrolment {
  id: string
  program_id: string
  employee_id: string
  progress: number
  status: 'enrolled' | 'completed' | 'dropped'
  enrolled_at: string
  completed_at?: string
}

export interface Trophy {
  id: string
  organisation_id: string
  name: string
  description?: string
  icon_url?: string
  created_at: string
}

export interface TrophyAward {
  id: string
  trophy_id: string
  employee_id: string
  awarded_at: string
}

export interface FeedEvent {
  id: string
  organisation_id: string
  employee_id?: string
  type: string
  title: string
  description?: string
  severity: 'info' | 'warning' | 'critical'
  timestamp: string
}

export interface ConnectedTool {
  id: string
  organisation_id: string
  tool_name: string
  is_connected: boolean
  employee_count?: number
  connected_at?: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface WatchlistItem {
  id: string
  organisation_id: string
  employee_id: string
  reason: string
  added_at: string
}

export interface CompanyEvent {
  id: string
  organisation_id: string
  title: string
  description?: string
  event_date: string
  created_at: string
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
