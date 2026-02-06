"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("ahmedraja@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (isLogin) {
        result = await signIn({
          email,
          password,
        });
      } else {
        result = await signUp({
          email,
          password,
          name: name || undefined,
        });
      }
      
      // Store the token and user info
      authClient.storeToken(result.token, result.user);
      
      router.push("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md w-96">
        <h1 className="text-2xl mb-4">{isLogin ? "Login" : "Sign Up"}</h1>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 p-2 border"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-2 text-sm text-blue-500"
        >
          {isLogin ? "Need an account?" : "Have an account?"}
        </button>
      </form>
    </div>
  );
}
