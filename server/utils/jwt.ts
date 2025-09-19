
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  jti?: string; // JWT ID for refresh tokens
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'nutrition-app'
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const refreshPayload = {
    ...payload,
    jti: randomUUID() // Unique ID for this refresh token
  };
  
  return jwt.sign(refreshPayload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'nutrition-app'
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
};

export const getCookieOptions = (isProduction: boolean = process.env.NODE_ENV === 'production') => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict' as const,
  path: '/'
});

export const getAccessTokenCookieOptions = (isProduction?: boolean) => ({
  ...getCookieOptions(isProduction),
  maxAge: 15 * 60 * 1000 // 15 minutes
});

export const getRefreshTokenCookieOptions = (isProduction?: boolean) => ({
  ...getCookieOptions(isProduction),
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
