import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export type WelcomeInfoProps = {
  onComplete: (info: { name: string; email: string }) => void;
};

export default function WelcomeInfo({ onComplete }: WelcomeInfoProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (name.trim() && email.trim()) {
      onComplete({ name: name.trim(), email: email.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl shadow-lg p-8 flex flex-col gap-4 w-full max-w-sm border border-border/30"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome!</h1>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Please enter your info to get started.
        </p>
        <input
          type="text"
          placeholder="Your Name"
          className="border rounded px-3 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full mt-2">
          Continue
        </Button>
        {submitted && (!name.trim() || !email.trim()) && (
          <div className="text-red-500 text-xs text-center">Both fields are required.</div>
        )}
      </form>
    </div>
  );
}
