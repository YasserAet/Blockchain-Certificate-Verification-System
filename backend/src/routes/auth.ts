import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, getUserByEmail, getUserPasswordHash, createStudentProfile, createInstitutionProfile, createEmployerProfile } from '../services/user.service'

export const authRoutes = Router()

const users: any[] = []

interface SignupBody {
  email: string
  password: string
  fullName: string
  role: 'student' | 'institution' | 'employer' | 'admin'
  institutionName?: string
  companyName?: string
}

authRoutes.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role, institutionName, companyName } = req.body as SignupBody

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const user = await createUser(email, password, fullName, role)

    if (role === 'student') {
      await createStudentProfile(user.id)
    } else if (role === 'institution') {
      if (!institutionName) {
        return res.status(400).json({ error: 'Institution name required' })
      }
      await createInstitutionProfile(user.id, institutionName)
    } else if (role === 'employer') {
      if (!companyName) {
        return res.status(400).json({ error: 'Company name required' })
      }
      await createEmployerProfile(user.id, companyName)
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.status(201).json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      token,
    })
  } catch (err: any) {
    console.error('[Auth] Signup error:', err)
    res.status(500).json({ error: err.message || 'Signup failed' })
  }
})

interface LoginBody {
  email: string
  password: string
}

authRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginBody

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordHash = await getUserPasswordHash(email)
    if (!passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordMatch = await bcrypt.compare(password, passwordHash)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      token,
    })
  } catch (err: any) {
    console.error('[Auth] Login error:', err)
    res.status(500).json({ error: err.message || 'Login failed' })
  }
})
