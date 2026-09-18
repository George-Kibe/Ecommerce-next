"use client"

import Image from 'next/image'
import { useSession, signIn } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-blue-900">Loading…</p>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex bg-blue-900 h-screen w-full rounded-md items-center justify-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn('google')}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-blue-900 h-full w-full">
      <div className="flex flex-row justify-between items-center px-10 py-4">
        <h2>Hello, {session?.user?.name}</h2>
        <div className="flex bg-gray-300 gap-1 py-1 rounded-2xl px-2 justify-center items-center text-black">
          {session?.user?.image && (
            <div className="w-8 h-8 relative">
              <Image
                src={session.user.image}
                fill
                sizes="32px"
                alt=""
                className="rounded-full object-cover"
              />
            </div>
          )}
          <p>{session?.user?.name}</p>
        </div>
      </div>
    </div>
  )
}
