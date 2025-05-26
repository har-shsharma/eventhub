import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthPayload {
    userId: string;
    role: 'admin' | 'staff' | 'owner';
    iat: number;
    exp: number;
  }

export function verifyToken(token: string) :AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest): Promise<AuthPayload | null> {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  
    const token = authHeader.split(' ')[1];
    if (!token) return null;
  
    return verifyToken(token);
  }
