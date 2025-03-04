import prisma from '@/lib/prisma'
import MapGeneration from './section.map-generate'

export default async function ScoreMap() {
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

  return (
    <section className="rounded border border-gray-400 min-w-80 w-fit p-5">
      <p className="pb-1">
        <b className="font-semibold">
          HTML maps
        </b>
        <br />
        <span className="text-sm leading-4">HTML payloads generated</span>
      </p>
      <MapGeneration />
      <hr className="my-3 border-dashed border-gray-400" />
      <ul className="max-h-[500px] overflow-y-auto">
        {maps.map((item) => (
          <li
            className={`py-1 px-2 rounded-md flex gap-x-2 items-center hover:bg-white/10 transition-all duration-150 text-base`}
            key={item.htmlIndex}
          >
            html_index_{item.htmlIndex}:{' '}
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-800">
              {item.challangeType}
            </span>
            <span className="text-sm">
              Max: {item.avgScores[0].toFixed(3)}, Min:{' '}
              {item.avgScores.at(-1)?.toFixed(3)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
