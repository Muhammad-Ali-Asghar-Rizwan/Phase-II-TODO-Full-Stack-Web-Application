import { NextRequest } from 'next/server';
import { db } from '@/lib/db/connection';
import { tasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);

    // Require authentication
    const authResult = await requireAuth(request);
    if ('status' in authResult) {
      return authResult; // Return the error response
    }
    const { user_id } = authResult;

    // Get the specific task
    const [task] = await db
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
      .where(eq(tasks.id, taskId));

    if (!task) {
      return new Response(
        JSON.stringify({ detail: 'Task not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if task belongs to the authenticated user
    if (task.userId !== user_id) {
      return new Response(
        JSON.stringify({ detail: 'Unauthorized: Task does not belong to this user' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format and return the response
    const response = {
      id: task.id,
      user_id: task.userId,
      title: task.title,
      description: task.description || null,
      completed: task.completed,
      created_at: task.createdAt.toISOString(),
      updated_at: task.updatedAt.toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Get task error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);

    // Require authentication
    const authResult = await requireAuth(request);
    if ('status' in authResult) {
      return authResult; // Return the error response
    }
    const { user_id } = authResult;

    const { title, description } = await request.json();

    // Get the task to check ownership
    const [task] = await db
      .select({ userId: tasks.userId })
      .from(tasks)
      .where(eq(tasks.id, taskId));

    if (!task) {
      return new Response(
        JSON.stringify({ detail: 'Task not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if task belongs to the authenticated user
    if (task.userId !== user_id) {
      return new Response(
        JSON.stringify({ detail: 'Unauthorized: Task does not belong to this user' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate input if provided
    if (title !== undefined) {
      if (title.trim().length === 0) {
        return new Response(
          JSON.stringify({ detail: 'Title cannot be empty' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (title.length > 200) {
        return new Response(
          JSON.stringify({ detail: 'Title must be less than 200 characters' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (description !== undefined && description.length > 1000) {
      return new Response(
        JSON.stringify({ detail: 'Description must be less than 1000 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the task
    const [updatedTask] = await db
      .update(tasks)
      .set({
        title: title !== undefined ? title.trim() : undefined,
        description: description !== undefined ? description : undefined,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    // Format and return the response
    const response = {
      id: updatedTask.id,
      user_id: updatedTask.userId,
      title: updatedTask.title,
      description: updatedTask.description || null,
      completed: updatedTask.completed,
      created_at: updatedTask.createdAt.toISOString(),
      updated_at: updatedTask.updatedAt.toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Update task error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);

    // Require authentication
    const authResult = await requireAuth(request);
    if ('status' in authResult) {
      return authResult; // Return the error response
    }
    const { user_id } = authResult;

    // Get the task to check ownership
    const [task] = await db
      .select({ userId: tasks.userId })
      .from(tasks)
      .where(eq(tasks.id, taskId));

    if (!task) {
      return new Response(
        JSON.stringify({ detail: 'Task not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if task belongs to the authenticated user
    if (task.userId !== user_id) {
      return new Response(
        JSON.stringify({ detail: 'Unauthorized: Task does not belong to this user' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the task
    await db.delete(tasks).where(eq(tasks.id, taskId));

    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);

    // Require authentication
    const authResult = await requireAuth(request);
    if ('status' in authResult) {
      return authResult; // Return the error response
    }
    const { user_id } = authResult;

    // Get the task to check ownership
    const [task] = await db
      .select({ userId: tasks.userId, completed: tasks.completed })
      .from(tasks)
      .where(eq(tasks.id, taskId));

    if (!task) {
      return new Response(
        JSON.stringify({ detail: 'Task not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if task belongs to the authenticated user
    if (task.userId !== user_id) {
      return new Response(
        JSON.stringify({ detail: 'Unauthorized: Task does not belong to this user' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Toggle completion status
    const [updatedTask] = await db
      .update(tasks)
      .set({
        completed: !task.completed,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    // Format and return the response
    const response = {
      id: updatedTask.id,
      user_id: updatedTask.userId,
      title: updatedTask.title,
      description: updatedTask.description || null,
      completed: updatedTask.completed,
      created_at: updatedTask.createdAt.toISOString(),
      updated_at: updatedTask.updatedAt.toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Toggle task completion error:', error);
    return new Response(
      JSON.stringify({ detail: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}