'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, Award } from 'lucide-react'

// ===== DEMO DATA CONSTANTS =====

interface Objective {
  id: string
  title: string
  completed: boolean
}

interface Program {
  id: string
  icon: string
  name: string
  tagline: string
  xpCurrent: number
  xpTotal: number
  questProgress: number
  goal: string
  objectives: Objective[]
  rewardName: string
  status?: 'on-track' | 'warning' | 'at-risk'
}

const PROGRAMS: Program[] = [
  {
    id: '1',
    icon: '💬',
    name: 'Engagement Operator',
    tagline: 'Master the art of connection',
    xpCurrent: 1450,
    xpTotal: 2000,
    questProgress: 57,
    goal: 'Send 100 messages and attend 20 team meetings',
    objectives: [
      { id: '1', title: 'Send 100+ messages this month', completed: true },
      { id: '2', title: 'Attend 15+ team meetings', completed: true },
      { id: '3', title: 'Participate in 5 team activities', completed: false },
      { id: '4', title: 'Share knowledge in team channel', completed: false },
    ],
    rewardName: 'Communication Master',
  },
  {
    id: '2',
    icon: '⚡',
    name: 'Responsiveness Specialist',
    tagline: 'Speed up your replies',
    xpCurrent: 1640,
    xpTotal: 2000,
    questProgress: 82,
    goal: 'Maintain sub-2 hour reply times on all messages',
    status: 'on-track',
    objectives: [
      { id: '1', title: 'Average response time under 2 hours', completed: true },
      { id: '2', title: 'Reply to 95% of messages same day', completed: true },
      { id: '3', title: 'Maintain streak for 15 days', completed: true },
      { id: '4', title: 'Mentor team on responsiveness', completed: false },
    ],
    rewardName: 'Response Time Champion',
  },
]

// ===== COMPONENT PARTS =====

const ProgramCard = ({ program, onToggleExpand, isExpanded }: { program: Program; onToggleExpand: (id: string) => void; isExpanded: boolean }) => {
  const xpPercent = (program.xpCurrent / program.xpTotal) * 100

  let xpBarColor = '#10B981' // Green
  if (program.xpPercent !== undefined) {
    if (xpPercent < 40) xpBarColor = '#EF4444'
    else if (xpPercent < 70) xpBarColor = '#F59E0B'
  }

  return (
    <div className="bg-blob-surface rounded-lg border border-blob-border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{program.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{program.name}</h3>
            <p className="text-sm text-gray-400">{program.tagline}</p>
          </div>
        </div>
        {program.status === 'on-track' && (
          <span className="px-3 py-1 bg-blob-primary/20 text-blob-primary text-xs font-bold rounded">
            ON TRACK
          </span>
        )}
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">XP Progress</span>
          <span className="text-xs font-bold text-white">{program.xpCurrent} / {program.xpTotal}</span>
        </div>
        <div className="w-full bg-blob-dark/50 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${xpPercent}%`, backgroundColor: xpBarColor }}
          />
        </div>
      </div>

      {/* Quest Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Quest Progress</span>
          <span className="text-xs font-bold text-white">{program.questProgress}%</span>
        </div>
        <div className="w-full bg-blob-dark/50 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-blob-primary transition-all"
            style={{ width: `${program.questProgress}%` }}
          />
        </div>
      </div>

      {/* Goal */}
      <div className="mb-4 p-3 bg-blob-dark/50 rounded border border-blob-border">
        <p className="text-xs font-medium text-blob-primary mb-1">Goal:</p>
        <p className="text-sm text-gray-300">{program.goal}</p>
      </div>

      {/* Expandable Objectives */}
      <div className="border-t border-blob-border pt-4">
        <button
          onClick={() => onToggleExpand(program.id)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-bold text-white">Objectives</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2">
            {program.objectives.map((obj) => (
              <div key={obj.id} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    borderColor: obj.completed ? '#10B981' : '#334155',
                    backgroundColor: obj.completed ? '#10B981' : 'transparent',
                  }}
                >
                  {obj.completed && <span className="text-xs font-bold text-white">✓</span>}
                </div>
                <span className={`text-xs ${obj.completed ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                  {obj.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unlock Reward */}
      <div className="border-t border-blob-border mt-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Unlock Reward:</span>
          <span className="flex items-center gap-2 text-sm font-bold text-yellow-400">
            <Award className="w-4 h-4" />
            {program.rewardName}
          </span>
        </div>
      </div>
    </div>
  )
}

// ===== MAIN PAGE COMPONENT =====

export default function ProgramsPage() {
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set())

  const toggleExpand = (programId: string) => {
    const newExpanded = new Set(expandedPrograms)
    if (newExpanded.has(programId)) {
      newExpanded.delete(programId)
    } else {
      newExpanded.add(programId)
    }
    setExpandedPrograms(newExpanded)
  }

  // Calculate overall stats
  const overallProgress = Math.round(
    (PROGRAMS.reduce((sum, p) => sum + p.questProgress, 0) / PROGRAMS.length)
  )
  const achievementsUnlocked = 8
  const achievementsTotal = 15
  const rewardsUnlocked = 0
  const rewardsTotal = 2
  const playerLevel = 14
  const totalXP = 3300
  const activeQuests = PROGRAMS.length

  return (
    <div className="min-h-screen bg-blob-darker p-8">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white mb-3">
          ✦ Quest Board ✦
        </h1>
        <p className="text-lg text-gray-400">
          Complete quests to level up and unlock epic rewards
        </p>
      </div>

      {/* Player Stats Bar */}
      <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
        <div className="bg-blob-surface rounded-lg border border-blob-border p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Player Level</p>
          <p className="text-3xl font-black text-blob-primary">{playerLevel}</p>
        </div>
        <div className="bg-blob-surface rounded-lg border border-blob-border p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Active Quests</p>
          <p className="text-3xl font-black text-blob-primary">{activeQuests}</p>
        </div>
        <div className="bg-blob-surface rounded-lg border border-blob-border p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Total XP</p>
          <p className="text-2xl font-black text-yellow-400">✦ {totalXP}</p>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {PROGRAMS.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onToggleExpand={toggleExpand}
            isExpanded={expandedPrograms.has(program.id)}
          />
        ))}
      </div>

      {/* Bottom Stats Bar */}
      <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto bg-blob-surface rounded-lg border border-blob-border p-6">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">Overall Progress</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-blob-dark/50 flex items-center justify-center">
              <span className="font-black text-blob-primary text-lg">{overallProgress}%</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">Achievements</p>
          <p className="font-black text-blob-primary text-lg">
            {achievementsUnlocked}/{achievementsTotal}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">Rewards Unlocked</p>
          <p className="font-black text-yellow-400 text-lg">
            {rewardsUnlocked}/{rewardsTotal}
          </p>
        </div>
      </div>
    </div>
  )
}
