import prisma from '@/lib/prisma'

export default async function PayloadAnalytics() {
  const result = await prisma.payloads.groupBy({
    by: ['htmlIndex'],
    _count: {
      variantIndex: true,
    },
    orderBy: {
      htmlIndex: 'asc',
    },
  })

  return (
    <section className="w-fit border border-gray-300 p-5 rounded-md">
      <p className='pb-1 font-semibold'>Payloads</p>
      <ul className="max-h-[600px] overflow-y-auto">
        {result.map((item) => (
          <li
            key={item.htmlIndex}
            className={`hover:bg-white/10 transition-all duration-150 rounded-sm flex items-center text-base py-1 px-2`}
          >
            <span
              className={`block mr-1 rounded-full size-5 ${
                item._count.variantIndex >= 50
                  ? 'bg-green-500'
                  : item._count.variantIndex >= 15
                  ? 'bg-blue-300'
                  : 'bg-slate-400'
              }`}
            />
            html_index_{item.htmlIndex}:{' '}
            <b className="font-semibold pl-2">{item._count.variantIndex}</b>
          </li>
        ))}
      </ul>
    </section>
  )
}
