import prisma from '@/lib/prisma'

export default async function Scores() {
  const scores = await prisma.scores.groupBy({
    by: ['htmlIndex'],
    _count: {
      groundTruthHtmlIndex: true,
    },
    orderBy: {
      htmlIndex: 'asc',
    },
  })

  const total = scores
  .map((item) => item._count.groundTruthHtmlIndex)
  .reduce((total, item) => total + item)

  return (
    <section className="w-fit border border-gray-300 p-5 rounded-md">
      <p className="pb-1">
        <b className="font-semibold">{scores.length} HTML Scores ({total})</b>
        <br />
        <span className='text-sm leading-4'>Count of scores for each html_index</span>
      </p>
      <ul className='max-h-[600px] overflow-y-auto'>
        {scores.map((item) => (
          <li
            className={`py-1 px-2 rounded-md flex gap-x-2 items-center hover:bg-white/10 transition-all duration-150 text-base`}
            key={item.htmlIndex}
          >
            html_index_{item.htmlIndex}:{' '}
            <b className="font-semibold">{item._count.groundTruthHtmlIndex}</b>
          </li>
        ))}
      </ul>
    </section>
  )
}
