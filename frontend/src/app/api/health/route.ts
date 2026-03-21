import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Vercel deployments
 * Used by load balancers and monitoring tools to verify the app is running
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    app: 'Blob',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  })
}
