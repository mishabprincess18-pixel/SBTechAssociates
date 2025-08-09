"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <h1 className="text-2xl font-serif mb-6">Sign in</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button onClick={() => signIn("credentials", { email, password, callbackUrl: "/dashboard" })}>
          Continue
        </Button>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">Use user@example.com / password123</div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Google</Button>
          <Button variant="secondary" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>GitHub</Button>
        </div>
      </div>
    </div>
  );
}