// This route handler is not needed since we're using the existing Python backend
// Authentication is handled by the Python FastAPI backend at /api/auth
// This file is kept for reference but not actively used

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response('Auth endpoints are handled by the Python backend', {
    status: 404,
  });
}

export async function POST(request: NextRequest) {
  return new Response('Auth endpoints are handled by the Python backend', {
    status: 404,
  });
}
