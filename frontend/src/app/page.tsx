"use client";
import { TodoList } from "@/components/todo-list";
import { UserMenu } from "@/components/user-menu";
import { AuthGuard } from "@/components/auth-guard";

export default function Home() {
  return (
    <AuthGuard>
      <div className="p-4">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold">Todo App</h1>
            <UserMenu />
        </header>
        <main>
            <TodoList />
        </main>
      </div>
    </AuthGuard>
  );
}