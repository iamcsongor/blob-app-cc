'use client'

import React, { useState, useEffect } from 'react'
import { Star, Award, Sparkles } from 'lucide-react'

// ===== DEMO DATA CONSTANTS =====

type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

interface Trophy {
  id: string
  icon: string
  name: string
  rarity: Rarity
  description: string
  awarded: number
  rarityPercent: number
}

interface LeaderboardEntry {
  rank: number
  name: string
  department: string
  stars: number
  avatar: string
}

const TROPHIES: Trophy[] = [
  {
    id: '1',
    icon: '💬',
    name: 'Conversation Starter',
    rarity: 'common',
    description: 'Initiated 50+ conversations this month',
    awarded: 134,
    rarityPercent: 67,
  },
  {
    id: '2',
    icon: '⚡',
    name: 'The Flash',
    rarity: 'rare',
    description: 'Responded to 100+ messages in under 2 hours',
    awarded: 24,
    rarityPercent: 12,
  },
  {
    id: '3',
    icon: '🎯',
    name: 'The Delegator',
    rarity: 'common',
    description: 'Successfully delegated 25+ tasks',
    awarded: 134,
    rarityPercent: 67,
  },
  {
    id: '4',
    icon: '🌙',
    name: 'The 24/7',
    rarity: 'epic',
    description: 'Maintained perfect availability for 30 days',
    awarded: 104,
    rarityPercent: 52,
  },
  {
    id: '5',
    icon: '🚀',
    name: 'Comeback Kid',
    rarity: 'legendary',
    description: 'Recovered from at-risk status to thriving',
    awarded: 18,
    rarityPercent: 9,
  },
  {
    id: '6',
    icon: '🎓',
    name: 'Knowledge Keeper',
    rarity: 'rare',
    description: 'Shared 10+ pieces of knowledge with team',
    awarded: 48,
    rarityPercent: 24,
  },
  {
    id: '7',
    icon: '🏆',
    name: 'Team Player',
    rarity: 'common',
    description: 'Participated in 15+ team activities',
    awarded: 134,
    rarityPercent: 67,
  },
  {
    id: '8',
    icon: '💪',
    name: 'Consistency Wins',
    rarity: 'epic',
    description: 'Maintained high engagement for 60+ days',
    awarded: 78,
    rarityPercent: 39,
  },
  {
    id: '9',
    icon: '🌟',
    name: 'Rising Star',
    rarity: 'rare',
    description: 'Improved wellbeing score by 20+ points',
    awarded: 56,
    rarityPercent: 28,
  },
  {
    id: '10',
    icon: '🎉',
    name: 'Social Butterfly',
    rarity: 'common',
    description: 'Attended 20+ social events',
    awarded: 134,
    rarityPercent: 67,
  },
  {
    id: '11',
    icon: '🔥',
    name: 'On Fire',
    rarity: 'epic',
    description: 'Achieved 5+ week streak of high productivity',
    awarded: 62,
    rarityPercent: 31,
  },
  {
    id: '12',
    icon: '✨',
    name: 'Excellence',
    rarity: 'legendary',
    description: 'Achieved 95+ wellbeing score for 90 days',
    awarded: 12,
    rarityPercent: 6,
  },
]

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah Chen', department: 'Engineering', stars: 15, avatar: '💬' },
  { rank: 2, name: 'Elena Rossi', department: 'Marketing', stars: 13, avatar: '🚀' },
  { rank: 3, name: 'Marcus Wright', department: 'Product', stars: 12, avatar: '🎯' },
  { rank: 4, name: 'Yuki Tanaka', department: 'Engineering', stars: 11, avatar: '⚡' },
  { rank: 5, name: 'Lisa Park', department: 'HR', stars: 10, avatar: '🏆' },
  { rank: 6, name: 'Priya Malhotra', department: 'Marketing', stars: 9, avatar: '💪' },
]

// ===== SVG TICKER ANIMATION =====

const TrophyTicker = () => {
  const recentAwards = [
    { name: 'Sarah Chen', trophy: '🚀 Comeback Kid' },
    { name: 'Marcus Wright', trophy: '⚡ The Flash' },
    { name: 'Elena Rossi', trophy: '💪 Consistency Wins' },
    { name: 'Yuki Tanaka', trophy: '🌟 Rising Star' },
    { name: 'Sarah Chen', trophy: '✨ Excellence' },
  ]

  return (
    <div className="w-full bg-blob-surface border-y border-blob-border overflow-hidden py-3">
      <div className="flex gap-8 animate-scroll">
        {[...recentAwards, ...recentAwards].map((award, idx) => (
          <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
            <Sparkles className="w-4 h-4 text-blob-primary flex-shrink-0" />
            <span className="text-sm text-gray-300">
              {award.name} earned {award.trophy}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}

// ===== TROPHY CARD COMPONENT =====

const TrophyCard = ({ trophy }: { trophy: Trophy }) => {
  const rarityStyles = {
    common: {
      border: '#94A3B8',
      bg: 'rgba(148, 163, 184, 0.1)',
      glow: 'rgba(148, 163, 184, 0.2)',
      badge: '#94A3B8',
      badgeBg: 'rgba(148, 163, 184, 0.2)',
    },
    rare: {
      border: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)',
      glow: 'rgba(59, 130, 246, 0.3)',
      badge: '#3B82F6',
      badgeBg: 'rgba(59, 130, 246, 0.2)',
    },
    epic: {
      border: '#A855F7',
      bg: 'rgba(168, 85, 247, 0.1)',
      glow: 'rgba(168, 85, 247, 0.3)',
      badge: '#A855F7',
      badgeBg: 'rgba(168, 85, 247, 0.2)',
    },
    legendary: {
      border: '#FCD34D',
      bg: 'rgba(252, 211, 77, 0.1)',
      glow: 'rgba(252, 211, 77, 0.3)',
      badge: '#FCD34D',
      badgeBg: 'rgba(252, 211, 77, 0.15)',
    },
  }

  const style = rarityStyles[trophy.rarity]

  return (
    <div
      className="rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
      style={{
        border: `2px solid ${style.border}`,
        backgroundColor: style.bg,
        boxShadow: `0 0 20px ${style.glow}`,
      }}
    >
      {/* Icon Background */}
      <div className="flex items-center justify-center h-32 rounded-lg mb-4" style={{ backgroundColor: style.glow }}>
        <span className="text-5xl">{trophy.icon}</span>
      </div>

      {/* Rarity Badge */}
      <div
        className="text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block"
        style={{
          backgroundColor: style.badgeBg,
          color: style.badge,
          border: `1px solid ${style.badge}`,
        }}
      >
        {trophy.rarity.toUpperCase()}
      </div>

      {/* Name and Description */}
      <h3 className="font-bold text-white mb-1">{trophy.name}</h3>
      <p className="text-xs text-gray-400 mb-4 min-h-8">{trophy.description}</p>

      {/* Stats */}
      <div className="border-t border-gray-600 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{trophy.awarded} awarded</span>
          <span className="text-xs font-bold text-gray-300">{trophy.rarityPercent}%</span>
        </div>
      </div>
    </div>
  )
}

// ===== LEADERBOARD ENTRY =====

const LeaderboardEntry = ({ entry }: { entry: LeaderboardEntry }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-blob-dark/50 rounded transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-sm font-bold text-blob-primary w-6">#{entry.rank}</span>
        <div className="w-8 h-8 rounded-full bg-blob-border/50 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">{entry.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{entry.name}</p>
          <p className="text-xs text-gray-400">{entry.department}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-bold text-white">{entry.stars}</span>
      </div>
    </div>
  )
}

// ===== MAIN PAGE COMPONENT =====

export default function TrophiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-blob-border p-8">
        <h1 className="text-4xl font-bold text-blob-dark mb-2">Trophy Cabinet</h1>
        <p className="text-gray-600">Celebrate achievements and unlock exclusive rewards</p>
      </div>

      {/* Trophy Ticker */}
      <TrophyTicker />

      {/* Main Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trophy Catalog (Left: 2 columns) */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-blob-dark mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-blob-primary" />
              Trophy Catalog
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {TROPHIES.map((trophy) => (
                <TrophyCard key={trophy.id} trophy={trophy} />
              ))}
            </div>
          </div>

          {/* Leaderboard Sidebar (Right: 1 column) */}
          <div>
            <div className="bg-white rounded-lg border border-blob-border p-6 sticky top-8 h-fit">
              <h2 className="text-lg font-bold text-blob-dark mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                Top Winners
              </h2>
              <div className="space-y-0 divide-y divide-blob-border">
                {LEADERBOARD.map((entry) => (
                  <LeaderboardEntry key={entry.rank} entry={entry} />
                ))}
              </div>

              {/* Leaderboard Stats */}
              <div className="mt-6 pt-6 border-t border-blob-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trophies</span>
                  <span className="font-bold text-blob-dark">{TROPHIES.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Stars/Person</span>
                  <span className="font-bold text-blob-primary">
                    {Math.round(LEADERBOARD.reduce((sum, e) => sum + e.stars, 0) / LEADERBOARD.length)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
