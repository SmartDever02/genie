import { ChallengeType } from '@prisma/client'

export default async function Overview({
  maps,
}: {
  maps: {
    challangeType: ChallengeType
    htmlIndex: number
    avgScores: number[]
  }[]
}) {
  const length = maps.length
  const maxAvg =
    maps.map((item) => item.avgScores[0]).reduce((sum, item) => sum + item, 0) /
    length

  const minAvg =
    maps
      .map((item) => item.avgScores.at(-1) || 0)
      .reduce((sum, item) => sum + item, 0) / length

  let s = 0,
    a = 0,
    b = 0,
    c = 0

  maps.forEach((item) => {
    if (item.avgScores[0] >= 0.9) {
      s++
    }
    if (item.avgScores[0] >= 0.85 && item.avgScores[0] < 0.9) {
      a++
    }
    if (item.avgScores[0] >= 0.75 && item.avgScores[0] < 0.85) {
      b++
    }
    if (item.avgScores[1] >= 0.5 && item.avgScores[0] < 0.75) {
      c++
    }
  })

  return (
    <section className="w-fit border border-gray-300 p-5 rounded-md">
      <p className="pb-1">
        <b className="font-semibold">Overview</b>
        <br />
        <span className="text-sm leading-4">General Dataset Overview</span>
      </p>
      <hr className="my-3 border-dashed border-gray-400" />

      <span className="text-base">
        Max Average: <b className="font-semibold">{maxAvg.toFixed(6)}</b>
      </span>
      <br />
      <span className="text-base">
        Min Average: <b className="font-semibold">{minAvg.toFixed(6)}</b>
      </span>

      <hr className="my-3 border-dashed border-gray-400" />

      <span className="text-base">
        0.9+:{' '}
        <b className="font-semibold">
          {s} ({((s / maps.length) * 100).toFixed(1)}%)
        </b>
      </span>
      <br />
      <span className="text-base">
        0.85+:{' '}
        <b className="font-semibold">
          {a} ({((a / maps.length) * 100).toFixed(1)}%)
        </b>
      </span>
      <br />
      <span className="text-base">
        0.75+:{' '}
        <b className="font-semibold">
          {b} ({((b / maps.length) * 100).toFixed(1)}%)
        </b>
      </span>
      <br />
      <span className="text-base">
        0.5+:{' '}
        <b className="font-semibold">
          {c} ({((c / maps.length) * 100).toFixed(1)}%)
        </b>
      </span>
    </section>
  )
}
