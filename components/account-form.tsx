"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { logEvent } from "@/lib/events";

// Credentials are never sent or stored: only the fact that a sign-in or sign-up was attempted is logged.
export default function AccountForm({ mode }: { mode: "signin" | "signup" }) {
  const from = useSearchParams().get("from") ?? undefined;
  const [failed, setFailed] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logEvent(mode === "signin" ? "signin_attempt" : "signup_attempt", from);
    event.currentTarget.reset();
    setFailed(true);
  };

  return (
    <form className="gate" onSubmit={submit}>
      <h1>{mode === "signin" ? "Sign in to Tallowfin" : "Create your Tallowfin account"}</h1>
      <input type="email" placeholder="Email address" aria-label="Email address" required />
      <input type="password" placeholder="Password" aria-label="Password" required />
      <button type="submit" className="btn">
        {mode === "signin" ? "Sign in" : "Create account"}
      </button>
      {failed && (
        <p className="muted">
          {mode === "signin"
            ? "We couldn't sign you in. Check your details and try again."
            : "We couldn't create your account right now. Please try again later."}
        </p>
      )}
    </form>
  );
}
