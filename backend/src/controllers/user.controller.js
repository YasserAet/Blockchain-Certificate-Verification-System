import { AppError } from '../middleware/errorHandler.js';
import { pool } from '../config/database.js';

export const getUserProfile = async (req, res, next) => {
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
      data: { user: result.rows[0] }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const { name, institution } = req.body;
    
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           institution = COALESCE($2, institution),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, role, institution`,
      [name, institution, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: result.rows[0] }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, email, role, institution, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user: result.rows[0] }
    });
  } catch (error) {
    next(error);
  }
};
