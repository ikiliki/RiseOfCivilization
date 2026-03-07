import jwt from 'jsonwebtoken';
import { config } from '../config.js';

interface SessionPayload {
  userId: string;
  username: string;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, config.authSecret, { expiresIn: '7d' });
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, config.authSecret) as SessionPayload;
}
