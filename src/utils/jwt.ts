import { createSecretKey } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { env } from '../../env.ts';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

const createKey = () => {
  const secret = env.JWT_SECRET;
  return createSecretKey(secret, 'utf-8');
};

export const generateToken = async (payload: JWTPayload) => {
  const secretKey = createKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || '7d')
    .sign(secretKey);
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const secretKey = createKey();
  const { payload } = await jwtVerify(token, secretKey);
  return payload as unknown as JWTPayload;
};
