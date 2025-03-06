'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CalculateAll() {
  const [range, setRange] = useState<string>('')
  const [isPending, setIsPending] = useState<boolean>(false)
  const router = useRouter()

  const handler = async () => {
    try {
      const [min, max] = range.split(',').map((item) => Number(item))

      setIsPending(true)
      const res = await fetch(`/api/map`, {
        method: 'POST',
        body: JSON.stringify({
          min,
          max,
        }),
      })
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
      setIsPending(false)
      setRange('')
      router.refresh()
    }
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <input
        disabled={isPending}
        placeholder="min,max"
        className="px-2 bg-white/10 rounded-md w-full"
        value={range}
        onChange={(e) => setRange(e.target.value)}
        type="text"
      />
      <button
        disabled={isPending}
        onClick={handler}
        className="mt-auto disabled:bg-slate-600 bg-blue-500 hover:bg-blue-400 text-white py-1.5 px-4 rounded text-sm w-full"
      >
        {isPending ? 'Pending...' : 'Calculate Maps [ALL]'}
      </button>
    </div>
  )
}
