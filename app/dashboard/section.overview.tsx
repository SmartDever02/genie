import prisma from '@/lib/prisma'

export default async function Overview() {
  const maps = await prisma.maps.findMany({
    select: {
      htmlIndex: true,
      challangeType: true,
      avgScores: true,
    },
    orderBy: {
      htmlIndex: 'asc',
    },
  })

  const maxAvg =
    maps.map((item) => item.avgScores[0]).reduce((sum, item) => sum + item, 0) /
    maps.length

  const minAvg =
    maps
      .map((item) => item.avgScores.at(-1) || 0)
      .reduce((sum, item) => sum + item, 0) / maps.length

  return (
    <section className="w-fit border border-gray-300 p-5 rounded-md">
      <p className="pb-1">
        <b className="font-semibold">Overview</b>
        <br />
        <span className="text-sm leading-4">General Dataset Overview</span>
      </p>
      <hr className="my-3 border-dashed border-gray-400" />

      <span className='text-base'>Max Average: <b className='font-semibold'>{maxAvg.toFixed(6)}</b></span>
      <br />
      <span className='text-base'>Min Average: <b className='font-semibold'>{minAvg.toFixed(6)}</b></span>
    </section>
  )
}
