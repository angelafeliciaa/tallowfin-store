"use client";

import { useState } from "react";

export default function EmailPopup() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Get 10% off">
      <div className="modal">
        <button type="button" className="x" aria-label="Close" onClick={() => setOpen(false)}>
          ×
        </button>
        <h2>Get 10% off your first order</h2>
        <p className="muted">Join the Tallowfin list for early access to new colors.</p>
        <input type="email" placeholder="Email address" aria-label="Email address" />
        <button type="button" className="btn" onClick={() => setOpen(false)}>
          Unlock 10% off
        </button>
      </div>
    </div>
  );
}
