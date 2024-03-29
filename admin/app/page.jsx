"use client"

import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const session = useSession();
  // console.log(session)
  if (session.status === "unauthenticated") {
    return (
      <div className="flex bg-blue-900 h-screen w-full rounded-md items-center justify-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }
  if (session.status === "authenticated") {
    return (
      <div className="text-blue-900 h-full w-full">
        <div className="flex flex-row justify-between items-center px-10 py-4">
          <h2 className="">Hello , {session.data.user.name}</h2>
          <div className="flex bg-gray-300 gap-1 py-1 rounded-2xl px-2 justify-center items-center text-black">
            <div className="w-8 h-8 relative">
              <Image src={session.data.user.image} fill alt={session.data.user.image} className='w-6 h-6 rounded-full' />
            </div>
              <p>{session.data.user.name}</p>
          </div>
        </div>
        
      </div>    
    )  
  } 
}
