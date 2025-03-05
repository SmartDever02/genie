'use client'

export default function CalculateAll() {
  const handler = async () => {
    try {
      const res = await fetch(`/api/map`)
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`)
      }
    } catch (e) {
      alert('Error re-calculating maps')
    }
  }

  return (
    <button onClick={handler} className="mt-auto disabled:bg-slate-600 bg-blue-500 hover:bg-blue-400 text-white py-1.5 px-4 rounded text-sm w-full">
      Calculate All
    </button>
  )
}
