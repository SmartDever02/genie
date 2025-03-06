'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CalculateAll() {
  const router = useRouter()

  const handler = async () => {
    try {
      const res = await fetch(`/api/map`)
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`)
      }
      const data = await res.json()

      toast.success(
        `Successfully calculated ${data.length} scores to generate full map!`
      )
    } catch (e) {
      toast.error('Failed to re-calculate scores to generate maps')
    } finally {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handler}
      className="mt-auto disabled:bg-slate-600 bg-blue-500 hover:bg-blue-400 text-white py-1.5 px-4 rounded text-sm w-full"
    >
      Calculate Maps [ALL]
    </button>
  )
}
