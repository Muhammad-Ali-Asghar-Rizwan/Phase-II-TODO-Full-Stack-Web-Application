import { NextRequest } from 'next/server';
import { db } from '@/lib/db/connection';
import { tasks, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if ('status' in authResult) {
      return authResult; // Return the error response
    }
    const { user_id } = authResult;

    // Get all tasks for the authenticated user
    const userTasks = await db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        title: tasks.title,
        description: tasks.description,
        completed: tasks.completed,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .where(eq(tasks.userId, user_id))
      .orderBy(desc(tasks.createdAt));

    // Format the response
    const formattedTasks = userTasks.map(task => ({
      id: task.id,
      user_id: task.userId,
      title: task.title,
      description: task.description || null,
      completed: task.completed,
      created_at: task.createdAt.toISOString(),
      updated_at: task.updatedAt.toISOString(),
    }));

    return new Response(JSON.stringify(formattedTasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Get tasks error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if ('status' in authResult) {
      return authResult; // Return the error response
    }
    const { user_id } = authResult;

    const { title, description } = await request.json();

    // Validate input
    if (!title || title.trim().length === 0) {
      return new Response(
        JSON.stringify({ detail: 'Title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (title.length > 200) {
      return new Response(
        JSON.stringify({ detail: 'Title must be less than 200 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (description && description.length > 1000) {
      return new Response(
        JSON.stringify({ detail: 'Description must be less than 1000 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new task
    const [newTask] = await db
      .insert(tasks)
      .values({
        userId: user_id,
        title: title.trim(),
        description: description || null,
        completed: false,
      })
      .returning();

    // Format and return the response
    const response = {
      id: newTask.id,
      user_id: newTask.userId,
      title: newTask.title,
      description: newTask.description || null,
      completed: newTask.completed,
      created_at: newTask.createdAt.toISOString(),
      updated_at: newTask.updatedAt.toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Create task error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}