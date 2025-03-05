'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MapGeneration() {
  const router = useRouter()

  const [index, setIndex] = useState<number>(Infinity)
  const [isPending, setIsPending] = useState<boolean>(false)

  const handler = async () => {
    try {
      if (Number.isNaN(index)) {
        return
      }

      setIsPending(true)
      const res = await fetch(`/api/map/${index}`, {
        body: JSON.stringify({
          type: 'ACCURACY',
        }),
        method: 'POST',
        headers: {
          'api-key': process.env.NEXT_PUBLIC_API_TOKEN || '',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to generate map')
      }

      alert('success!')
      router.refresh()
    } catch (e) {
      alert('Failed to generate map for html index: ' + index)
    } finally {
      setIndex(Infinity)
      setIsPending(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <input
          className="w-full bg-white/10 px-2 placeholder:text-sm"
          id="html_index"
          placeholder="html_index"
          value={index?.toString()}
          onChange={(e) => setIndex(Number(e.target.value))}
          disabled={isPending}
        />
        <button
          disabled={isPending}
          onClick={handler}
          className="disabled:bg-slate-600 bg-blue-500 hover:bg-blue-400 text-white py-1.5 px-4 rounded text-sm"
        >
          {isPending ? 'Pending' : 'Generate Map'}
        </button>
      </div>
    </div>
  )
}
