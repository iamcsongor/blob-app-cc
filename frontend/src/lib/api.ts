import { createClient } from './supabase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getAuthToken(): Promise<string | null> {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    console.error('Failed to get auth token:', error)
    return null
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} ${error}`)
  }
  return response.json()
}

export const api = {
  async get(path: string, params?: Record<string, any>) {
    const url = new URL(`${API_URL}${path}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    })
    return handleResponse(response)
  },

  async post(path: string, body?: any) {
    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    return handleResponse(response)
  },

  async put(path: string, body?: any) {
    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })
    return handleResponse(response)
  },

  async delete(path: string) {
    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers,
    })
    return handleResponse(response)
  },
}
