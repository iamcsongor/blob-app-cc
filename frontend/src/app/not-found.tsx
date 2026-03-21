import Link from 'next/link'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Page not found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blob-primary text-white rounded-lg font-medium hover:bg-blob-primary/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
