'use client'

export default function PayloadTodo() {
  const getIndexesHandler = async () => {
    try {
      const res = await fetch(`/api/payload-todo`)
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`)
      }

      const data = await res.json()
      console.log(data)
    } catch (e) {
      alert('Error fetching payload')
    }
  }

  const getInvalidPayloadHandler = async () => {
    try {
      const res = await fetch(`/api/payload-format`)
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`)
      }

      const data = await res.json()
      console.log(data)
    } catch (e) {
      alert('Error fetching payload')
    }
  }

  return (
    <div className='w-full flex flex-col gap-2'>
      <button
        onClick={getIndexesHandler}
        className="disabled:bg-slate-600 bg-blue-500 hover:bg-blue-400 text-white py-1.5 px-4 rounded text-sm"
      >
        Get Missing HTML Indexes
      </button>
      <button
        onClick={getInvalidPayloadHandler}
        className="disabled:bg-slate-600 bg-blue-500 hover:bg-blue-400 text-white py-1.5 px-4 rounded text-sm"
      >
        Get Invalid Payloads
      </button>
    </div>
  )
}
