'use client'

import { createClient } from "@/utils/supabase/client"

export default function LogOut() {
  const supabase = createClient()

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    console.log('error: ', error)
    window.location.reload();
  }


  return <button onClick={signOut} className="w-fit rounded-full px-4 py-2 bg-slate-500">Logout</button>
}