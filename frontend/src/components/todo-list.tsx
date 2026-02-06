"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { TodoItem } from "./todo-item";

interface Todo {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    owner_id: string;
}

export function TodoList() {
    const { data: session } = useSession();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Note: Assuming session has a way to get token or we use a proxy. 
    // For this implementation, we assume we can fetch directly.
    // Since we enabled JWT strategy, we might need to extract it.
    // For now, using standard fetch. 
    // In a real scenario, we'd pass `Authorization: Bearer ...` if accessible.
    
    const fetchTodos = async () => {
        if (!session) return;
        try {
            // Placeholder: Getting token from session if available
            // const token = (session as any).token; 
            const res = await fetch(`${API_URL}/todos/`, {
                headers: {
                     // Authorization: `Bearer ${token}` 
                }
            });
            if (res.ok) {
                const data = await res.json();
                setTodos(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const createTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim() || !session) return;
        
        try {
            const res = await fetch(`${API_URL}/todos/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ...`
                },
                body: JSON.stringify({
                    title: newTodo,
                    owner_id: "placeholder" // Backend overwrites this
                })
            });
            if (res.ok) {
                setNewTodo("");
                fetchTodos();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateTodo = async (id: number, updates: Partial<Todo>) => {
        try {
            const res = await fetch(`${API_URL}/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: ...
                },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                fetchTodos();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
             const res = await fetch(`${API_URL}/todos/${id}`, {
                method: "DELETE",
                headers: {
                    // Authorization: ...
                }
            });
            if (res.ok) {
                fetchTodos();
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [session]);

    if (!session) return <div>Please login</div>;

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">My Todos</h1>
            <form onSubmit={createTodo} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="New Todo"
                    className="flex-1 p-2 border rounded"
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add</button>
            </form>
            <div className="bg-white rounded shadow">
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onUpdate={updateTodo}
                        onDelete={deleteTodo}
                    />
                ))}
            </div>
        </div>
    );
}
