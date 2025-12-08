/**
 * API Route: Authentication - Login
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server'

// Use server-side URL (internal Docker network or localhost for development)
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://backend:3001/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Logging in user:', body.email)
    console.log('Backend URL:', BACKEND_URL)

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Backend login error:', data)
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      )
    }

    console.log('Login successful')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
