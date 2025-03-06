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
      <h3 className='font-semibold pb-1'>Overview</h3>
      Max Average: {maxAvg.toFixed(3)}
      <br />
      Min Average: {minAvg.toFixed(3)}
    </section>
  )
}
