/**
 * API Route: Upload Certificate
 * POST /api/certificates/upload
 */

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://backend:3001/api'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()

    const response = await fetch(`${BACKEND_URL}/certificates/upload`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Upload failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
