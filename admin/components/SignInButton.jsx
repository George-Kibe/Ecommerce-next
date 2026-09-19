"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.74-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.49l2.64-2.54C16.86 3.4 14.64 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.54 0 9.2-3.9 9.2-9.38 0-.63-.07-1.11-.15-1.6H12z" />
  </svg>
)

export default function SignInButton() {
  const [pending, setPending] = useState(false)
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => { setPending(true); signIn("google") }}
      className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-field-line bg-surface px-5 font-medium text-fg hover:bg-hover disabled:opacity-60"
    >
      {pending ? (
        <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent" />
      ) : (
        <GoogleIcon />
      )}
      {pending ? "Redirecting to Google…" : "Continue with Google"}
    </button>
  )
}
