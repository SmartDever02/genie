import ScoreMap from './section.map'
import Overview from './section.overview'
import PayloadAnalytics from './section.payload-analytics'
import Scores from './section.scores'
import Logs from './section.logs'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const scores = await prisma.scores.groupBy({
    by: ['htmlIndex'],
    _count: {
      groundTruthHtmlIndex: true,
    },
    orderBy: {
      htmlIndex: 'asc',
    },
  })

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
    <main className="p-10 flex gap-4">
      <PayloadAnalytics />
      <Scores scores={scores} />
      <ScoreMap scores={scores} maps={maps} />
      <Overview maps={maps} />
      <Logs />
    </main>
  )
}
