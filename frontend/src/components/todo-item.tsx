"use client";

import { useState } from "react";

interface Todo {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    owner_id: string;
}

interface TodoItemProps {
    todo: Todo;
    onUpdate: (id: number, updates: Partial<Todo>) => void;
    onDelete: (id: number) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);

    const handleSave = () => {
        onUpdate(todo.id, { title });
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={todo.is_completed}
                    onChange={(e) => onUpdate(todo.id, { is_completed: e.target.checked })}
                />
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-1"
                    />
                ) : (
                    <span className={todo.is_completed ? "line-through text-gray-500" : ""}>
                        {todo.title}
                    </span>
                )}
            </div>
            <div className="flex gap-2">
                {isEditing ? (
                    <button onClick={handleSave} className="text-green-500">Save</button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="text-blue-500">Edit</button>
                )}
                <button onClick={() => onDelete(todo.id)} className="text-red-500">Delete</button>
            </div>
        </div>
    );
}
