'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button className="p-4" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <div className="p-2">
      Not signed in <br />
      <button className="bg-orange-500 px-3 mt-4 py-1 rounded-lg" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}