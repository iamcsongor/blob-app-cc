'use client'

import { useState } from 'react'
import {
  Upload,
  Check,
  X,
  Slack,
  Users,
  Mail,
  Video,
  DollarSign,
  Github,
  Zap,
} from 'lucide-react'

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    companyName: 'Acme Corporation',
    timezone: 'UTC',
    currency: 'USD',
  })
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    console.log('Saving form data:', formData)
    setTimeout(() => {
      setIsSaving(false)
      setIsDirty(false)
    }, 1000)
  }

  const [connectedTools, setConnectedTools] = useState<
    Record<string, boolean>
  >({
    slack: true,
    teams: false,
    google_workspace: true,
    zoom: true,
    outlook: false,
    salesforce: false,
    hubspot: true,
    github: false,
    workday: false,
    chatgpt: true,
  })

  const tools = [
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and messaging',
      color: 'bg-blue-500',
      letter: 'S',
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Enterprise collaboration platform',
      color: 'bg-purple-500',
      letter: 'M',
    },
    {
      id: 'google_workspace',
      name: 'Google Workspace',
      description: 'Cloud productivity suite',
      color: 'bg-red-500',
      letter: 'G',
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Video conferencing and meetings',
      color: 'bg-blue-400',
      letter: 'Z',
    },
    {
      id: 'outlook',
      name: 'Outlook',
      description: 'Email and calendar management',
      color: 'bg-blue-600',
      letter: 'O',
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM and customer management',
      color: 'bg-indigo-600',
      letter: 'S',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Sales and marketing platform',
      color: 'bg-orange-500',
      letter: 'H',
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Code repository and version control',
      color: 'bg-gray-800',
      letter: 'G',
    },
    {
      id: 'workday',
      name: 'Workday',
      description: 'HRM and financial management',
      color: 'bg-blue-700',
      letter: 'W',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'AI assistance and automation',
      color: 'bg-green-500',
      letter: 'C',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure your organization and connected tools
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Company Setup */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Company Logo Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Company Logo</h3>
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-blob-primary to-blob-primary/70 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-3">
                  AC
                </div>
                <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Click to upload or drag and drop
              </p>
            </div>

            {/* Company Info Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Company Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange('companyName', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) =>
                      handleInputChange('timezone', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
                  >
                    <option>UTC</option>
                    <option>Europe/London</option>
                    <option>Europe/Berlin</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Asia/Tokyo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange('currency', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>CHF</option>
                    <option>JPY</option>
                  </select>
                </div>
              </div>

              {isDirty && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full mt-4 px-4 py-2 bg-blob-primary text-white rounded-lg font-medium hover:bg-blob-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>

            {/* Customer Success Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Customer Success
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blob-primary rounded-full flex items-center justify-center text-white font-semibold">
                  MS
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    Maria Santos
                  </p>
                  <p className="text-xs text-gray-600">CSM</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                maria.santos@blob.com
              </p>
              <p className="text-xs text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Right Column: Integrations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">
              Connected Tools
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Connect your workplace tools to start collecting engagement
              signals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool) => {
                const isConnected = connectedTools[tool.id]
                const employeeCount = isConnected
                  ? Math.floor(Math.random() * 500) + 50
                  : 0

                return (
                  <div
                    key={tool.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`${tool.color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                        >
                          {tool.letter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {tool.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() =>
                          setConnectedTools((prev) => ({
                            ...prev,
                            [tool.id]: !prev[tool.id],
                          }))
                        }
                        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                          isConnected ? 'bg-blob-primary' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            isConnected ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Connection Status */}
                    {isConnected && (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                        <Check className="w-4 h-4" />
                        {employeeCount} employees
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
