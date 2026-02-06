import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-super-secret-jwt-key-change-this-in-production';
const ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';
const EXPIRE_MINUTES = parseInt(process.env.JWT_EXPIRE_MINUTES || '10080'); // 7 days

export async function createAccessToken(userId: string, email: string): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + EXPIRE_MINUTES * 60;

  return new SignJWT({ email })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(userId)
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const verified = await jwtVerify(token, secret);
    
    const user_id = verified.payload.sub;
    const email = verified.payload.email as string;
    
    if (!user_id || !email) {
      return null;
    }
    
    return { user_id, email };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function decodeToken(token: string) {
  const payload = await verifyToken(token);
  if (payload) {
    return payload.user_id;
  }
  return null;
}