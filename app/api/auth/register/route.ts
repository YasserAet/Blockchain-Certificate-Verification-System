/**
 * API Route: Authentication - Register
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server'

// Use server-side URL (internal Docker network or localhost for development)
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://backend:3001/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Registering user:', { email: body.email, role: body.role })
    console.log('Backend URL:', BACKEND_URL)

    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Backend registration error:', data)
      return NextResponse.json(
        { message: data.message || 'Registration failed' },
        { status: response.status }
      )
    }

    console.log('Registration successful')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
