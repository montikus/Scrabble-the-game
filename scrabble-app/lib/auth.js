// lib/auth.js
import jwt from 'jsonwebtoken';
import logger from '@/lib/logger';

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    logger.error('Error token vetification:', error);
    return null;
  }
}

export function checkAdmin(decodedToken) {
  return decodedToken?.role === 'admin';
}

export function extractTokenFromHeader(req) {
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}
