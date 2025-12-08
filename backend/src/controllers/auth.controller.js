import bcrypt from 'bcryptjs';
import { AppError } from '../middleware/errorHandler.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { generateToken } from '../utils/jwt.js';
import { pool } from '../config/database.js';

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role, institution } = validatedData;

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, institution, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
       RETURNING id, name, email, role, institution, created_at`,
      [name, email, hashedPassword, role, institution || null]
    );

    const user = result.rows[0];

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institution: user.institution
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const result = await pool.query(
      'SELECT id, name, email, password, role, institution FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institution: user.institution
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const result = await pool.query(
      'SELECT id, name, email, role, institution, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
};
