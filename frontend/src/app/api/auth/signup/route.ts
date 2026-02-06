import { NextRequest } from 'next/server';
import { db } from '@/lib/db/connection';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, validateEmail } from '@/lib/bcrypt';
import { createAccessToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // Validate email
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ detail: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ detail: 'Email already registered' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate password length
    const byteLength = Buffer.byteLength(password, 'utf8');
    if (byteLength < 8) {
      return new Response(
        JSON.stringify({ detail: 'Password must be at least 8 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    try {
      const hashedPassword = await hashPassword(password);
      
      // Create new user
      const [newUser] = await db.insert(users).values({
        email,
        passwordHash: hashedPassword,
        name: name || null,
      }).returning();

      // Generate JWT token
      const token = await createAccessToken(newUser.id, newUser.email);

      // Return success response
      return new Response(
        JSON.stringify({
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name || undefined,
            created_at: newUser.createdAt.toISOString(),
          }
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {
      if (error.message.includes('exceeds maximum length')) {
        return new Response(
          JSON.stringify({ detail: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}