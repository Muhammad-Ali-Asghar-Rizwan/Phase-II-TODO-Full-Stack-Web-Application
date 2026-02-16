import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function verifyAuth(request: NextRequest): Promise<{ user_id: string; email: string } | null> {
  const authHeader = request.headers.get('authorization');
  console.log('DEBUG: Middleware auth header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'MISSING');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('DEBUG: No Bearer token found');
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  console.log('DEBUG: Middleware token length:', token.length);
  console.log('DEBUG: Middleware token starts with:', token.substring(0, 10));
  
  const payload = await verifyToken(token);
  console.log('DEBUG: Middleware verifyToken result:', payload ? 'SUCCESS' : 'FAILED');

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