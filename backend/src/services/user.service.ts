import { queryDatabase } from './database'
import bcrypt from 'bcrypt'

export interface User {
  id: string
  email: string
  fullName: string
  role: 'student' | 'institution' | 'employer' | 'admin'
  createdAt: Date
}

export async function createUser(
  email: string,
  password: string,
  fullName: string,
  role: 'student' | 'institution' | 'employer' | 'admin'
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const result = await queryDatabase(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, role, created_at`,
    [email, hashedPassword, fullName, role]
  )

  if (result.rows.length === 0) {
    throw new Error('Failed to create user')
  }

  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    fullName: result.rows[0].full_name,
    role: result.rows[0].role,
    createdAt: result.rows[0].created_at,
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await queryDatabase(
    `SELECT id, email, full_name, role, created_at FROM users WHERE email = $1`,
    [email]
  )

  if (result.rows.length === 0) {
    return null
  }

  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    fullName: result.rows[0].full_name,
    role: result.rows[0].role,
    createdAt: result.rows[0].created_at,
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await queryDatabase(
    `SELECT id, email, full_name, role, created_at FROM users WHERE id = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    return null
  }

  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    fullName: result.rows[0].full_name,
    role: result.rows[0].role,
    createdAt: result.rows[0].created_at,
  }
}

export async function getUserPasswordHash(email: string): Promise<string | null> {
  const result = await queryDatabase(
    `SELECT password_hash FROM users WHERE email = $1`,
    [email]
  )

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0].password_hash
}

export async function createStudentProfile(userId: string): Promise<any> {
  const result = await queryDatabase(
    `INSERT INTO students (user_id) VALUES ($1) RETURNING id, user_id, created_at`,
    [userId]
  )

  return result.rows[0]
}

export async function createInstitutionProfile(userId: string, institutionName: string): Promise<any> {
  const result = await queryDatabase(
    `INSERT INTO institutions (user_id, institution_name) VALUES ($1, $2) RETURNING id, user_id, institution_name`,
    [userId, institutionName]
  )

  return result.rows[0]
}

export async function createEmployerProfile(userId: string, companyName: string): Promise<any> {
  const result = await queryDatabase(
    `INSERT INTO employers (user_id, company_name) VALUES ($1, $2) RETURNING id, user_id, company_name`,
    [userId, companyName]
  )

  return result.rows[0]
}
