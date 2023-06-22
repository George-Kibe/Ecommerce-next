"use client"

import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const session = useSession();
  // console.log(session)

  if (session.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-24 h-24 border-8 border-t-8 border-gray-500 rounded-full animate-spin"></div>
        <h1 className="mt-8 text-3xl font-semibold text-gray-800">Loading...</h1>
      </div>
    );
  }
  if (session.status === "unauthenticated") {
    //router?.push("/dashboard/login");
    return (
      <div className="bg-blue-900 w-screen ">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    )
  }
  if (session.status === "authenticated") {
    return (
      <div className="flex flex-col items-center p-8 h-screen">
        <div className='flex flex-row justify-center items-center gap-2'>
          {
            session.data.user.image && 
            <Image src={session.data.user.image} width={50} height={50} alt={session.data.user.image} 
              className='rounded-full'
            />
          }
          <p>Logged in as {session.data.user.name}-{session.data.user.email}</p>
        </div>
      </div>  
    )  
  }

 
}
