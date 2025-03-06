import prisma from '@/lib/prisma'

export default async function Logs() {
  const logs = await prisma.logs.findMany()

  return (
    <section className="rounded border border-gray-400 min-w-80 w-fit p-5">
      <p className="pb-1">
        <b className="font-semibold">{logs.length} Logs</b>
        <br />
        <span className="text-sm leading-4">
          Synapse logs and expected scores
        </span>
      </p>

      <hr className="my-3 border-dashed border-gray-400" />

      <ul className="max-h-[500px] overflow-y-auto mb-5">
        {logs.map((item) => (
          <li
            className={`py-1 px-2 rounded-md flex gap-x-2 items-center hover:bg-white/10 transition-all duration-150 text-base`}
            key={item.htmlIndex}
          >
            Task-{item.taskId.substring(0, 8) + '...'}
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-800">
              {item.challengeType}
            </span>
            <span className='text-sm'>
              Expected Score: <b>{item.expectedScore?.toFixed(3) || 0}</b>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
