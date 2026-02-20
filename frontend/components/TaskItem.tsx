"use client";

import { useState } from "react";
import type { Task } from "../lib/types";
import { deleteTask, updateTask } from "../lib/api";
import TaskForm from "./TaskForm";
import DeleteConfirm from "./DeleteConfirm";

interface TaskItemProps {
  task: Task;
  onToggleComplete?: (taskId: number) => void;
  onTaskUpdated?: () => void;
}

export default function TaskItem({ task, onToggleComplete, onTaskUpdated }: TaskItemProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleEditSave = async (data: { title: string; description?: string }) => {
    try {
      await updateTask(task.id, data);
      setShowEditForm(false);
      onTaskUpdated?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(task.id);
      setShowDeleteConfirm(false);
      onTaskUpdated?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  return (
    <div
      className={`border rounded-xl p-5 transition-all duration-200 hover:shadow-md ${
        task.completed
          ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
          : "bg-gradient-to-r from-white to-gray-50 border-gray-200"
      }`}
    >
      {showEditForm ? (
        <div className="p-2 -m-2 rounded-lg">
          <TaskForm
            mode="edit"
            taskId={task.id}
            initialData={{ title: task.title, description: task.description || undefined }}
            onSuccess={handleEditSave}
            onCancel={() => setShowEditForm(false)}
          />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-4 flex-1">
              <button
                onClick={() => onToggleComplete?.(task.id)}
                className={`mt-1 shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.completed
                    ? "bg-gradient-to-r from-green-500 to-green-600 border-green-500 w-6 h-6"
                    : "bg-white border-gray-400 hover:border-blue-500"
                }`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed && (
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-base font-semibold ${
                    task.completed ? "text-gray-500 line-through" : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className={`mt-2 text-sm ${
                        task.completed ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg shadow-sm text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.completed
                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                  : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
              }`}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <DeleteConfirm
          taskTitle={task.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
