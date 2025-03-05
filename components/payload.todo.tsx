'use client'

interface PropsType {
  htmlIndexes: number[]
}

export default function PayloadTodo(props: PropsType) {
  const handler = async () => {
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

  return (
    <button
      onClick={handler}
      className="disabled:bg-slate-600 bg-blue-500 hover:bg-blue-400 text-white py-1.5 px-4 rounded text-sm w-full"
    >
      Get Missing HTML Indexes
    </button>
  )
}
