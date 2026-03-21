'use client'

import Link from 'next/link'
import { Mail, Lock, Chrome, Github } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-4 h-4 rounded-full bg-blob-primary" />
        <span className="font-bold text-lg text-gray-900">BLOB</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Sign in to Blob
      </h1>
      <p className="text-center text-gray-600 text-sm mb-8">
        Welcome back. Enter your details to get started.
      </p>

      {/* Form */}
      <form className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blob-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            href="#"
            className="text-sm text-blob-primary hover:text-blob-primary/80 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blob-primary text-white rounded-lg font-medium hover:bg-blob-primary/90 transition-colors mt-6"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-600">or</span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <button className="w-full py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <Chrome className="w-4 h-4" />
          Sign in with Google
        </button>
        <button className="w-full py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <Github className="w-4 h-4" />
          Sign in with Microsoft
        </button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-blob-primary hover:text-blob-primary/80 font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
