import { ChallengeType, Prisma } from '@prisma/client'

export default async function Scores({
  scores,
  maps,
  payloads,
}: {
  payloads: (Prisma.PickEnumerable<
    Prisma.PayloadsGroupByOutputType,
    'htmlIndex'[]
  > & {
    _count: {
      variantIndex: number
    }
  })[]
  maps: {
    challangeType: ChallengeType
    htmlIndex: number
    avgScores: number[]
  }[]
  scores: (Prisma.PickEnumerable<
    Prisma.ScoresGroupByOutputType,
    'htmlIndex'[]
  > & {
    _count: {
      groundTruthHtmlIndex: number
    }
  })[]
}) {
  const total = scores
    .map((item) => item._count.groundTruthHtmlIndex)
    .reduce((total, item) => total + item, 0)

  return (
    <section className="w-fit border border-gray-300 p-5 rounded-md">
      <p className="pb-1">
        <b className="font-semibold">
          {scores.length} HTML Scores ({total})
        </b>
        <br />
        <span className="text-sm leading-4">
          Count of scores for each html_index
        </span>
      </p>
      <hr className="my-3 border-dashed border-gray-400" />
      <ul className="max-h-[600px] overflow-y-auto">
        {scores.map((item) => {
          const map = maps.find(
            (element) => element.htmlIndex === item.htmlIndex
          )

          const payload = payloads.find(
            (element) => element.htmlIndex === item.htmlIndex
          )

          return (
            <li
              className={`py-1 px-2 rounded-md flex gap-x-2 items-center hover:bg-white/10 transition-all duration-150 text-base`}
              key={item.htmlIndex}
            >
              <span>{map ? '✅' : '❌'}</span>
              html_index_{item.htmlIndex}:{' '}
              <b className="font-semibold">
                {item._count.groundTruthHtmlIndex}
              </b>
              {
                payload?._count.variantIndex === item._count.groundTruthHtmlIndex || item._count.groundTruthHtmlIndex >=10 ? "(Full)" : "(Partial)"
              }
            </li>
          )
        })}
      </ul>
    </section>
  )
}
