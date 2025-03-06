import MapGeneration from './section.map-generate'
import CalculateAll from '@/components/client.score'
import { ChallengeType, Prisma } from '@prisma/client'

export default async function ScoreMap({
  scores,
  maps,
}: {
  scores: (Prisma.PickEnumerable<
    Prisma.ScoresGroupByOutputType,
    'htmlIndex'[]
  > & {
    _count: {
      groundTruthHtmlIndex: number
    }
  })[]
  maps: {
    challangeType: ChallengeType
    htmlIndex: number
    avgScores: number[]
  }[]
}) {
  return (
    <section className="rounded border border-gray-400 min-w-80 w-fit p-5">
      <p className="pb-1">
        <b className="font-semibold">{maps.length} HTML maps</b>
        <br />
        <span className="text-sm leading-4">HTML payloads generated</span>
      </p>
      <hr className="my-3 border-dashed border-gray-400" />
      <MapGeneration />
      <hr className="my-3 border-dashed border-gray-400" />
      <ul className="max-h-[500px] overflow-y-auto mb-5">
        {maps.map((item) => {
          const score = scores.find(
            (element) => element.htmlIndex === item.htmlIndex
          )

          return (
            <li
              className={`py-1 px-2 rounded-md flex gap-x-2 items-center hover:bg-white/10 transition-all duration-150 text-base`}
              key={item.htmlIndex}
            >
              {item.avgScores.length >
              (score?._count?.groundTruthHtmlIndex || Infinity) - 1 ? (
                <span className="w-12 text-center px-2 bg-green-800 rounded text-sm">
                  FULL
                </span>
              ) : (
                <span className="w-12 text-center px-2 bg-red-800 rounded text-sm">
                  MISS
                </span>
              )}
              html_index_{item.htmlIndex}:{' '}
              <span className="text-[10px] font-semibold px-2 rounded-full bg-green-800">
                {item.challangeType}
              </span>
              <span className="text-sm">
                Max:{' '}
                <b className="font-semibold">{item.avgScores[0].toFixed(3)}</b>,
                Min:{' '}
                <b className="font-semibold">
                  {item.avgScores.at(-1)?.toFixed(3)}
                </b>
              </span>
            </li>
          )
        })}
      </ul>
      <CalculateAll />
    </section>
  )
}
