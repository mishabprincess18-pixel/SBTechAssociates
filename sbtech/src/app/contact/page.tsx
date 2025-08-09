"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify({ name, email, message }) });
    if (res.ok) setStatus("Message sent successfully.");
    else setStatus("Failed to send. Try again.");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-serif mb-8">Contact Us</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <textarea id="message" className="h-32 w-full rounded-md border px-3 py-2 text-sm" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <Button type="submit">Send</Button>
        {status && <div className="text-sm mt-2">{status}</div>}
      </form>
    </div>
  );
}