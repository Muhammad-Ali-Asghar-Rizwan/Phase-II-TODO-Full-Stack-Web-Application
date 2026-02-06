import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function verifyAuth(request: NextRequest): Promise<{ user_id: string; email: string } | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const payload = await verifyToken(token);
  
  return payload;
}

export async function requireAuth(request: NextRequest): Promise<{ user_id: string; email: string } | NextResponse> {
  const payload = await verifyAuth(request);
  
  if (!payload) {
    return NextResponse.json(
      { detail: 'Invalid or expired authentication token' },
      { status: 401 }
    );
  }
  
  return payload;
}