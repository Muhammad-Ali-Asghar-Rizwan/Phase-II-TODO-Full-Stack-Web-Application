import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    // Require authentication using frontend's own auth system
    const authResult = await requireAuth(request);
    if ('status' in authResult) {
      return authResult; // Return the error response
    }
    const { user_id } = authResult;

    const { message, user_id: requestUserId } = await request.json();

    // Validate input
    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ detail: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use the authenticated user's ID if not provided in the request
    const userId = requestUserId || user_id;

    // Forward the request to the backend AI endpoint
    const authHeader = request.headers.get('authorization');
    console.log('DEBUG: Frontend auth header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'MISSING');
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('DEBUG: Extracted token length:', token?.length);
    console.log('DEBUG: Token starts with:', token?.substring(0, 10));
    
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/ai/chat/conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: message,
        user_id: userId
      })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return new Response(
        JSON.stringify(errorData),
        { status: backendResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await backendResponse.json();
    
    return new Response(JSON.stringify(aiResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Chat conversation error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}