import ScoreMap from './section.map'
import Overview from './section.overview'
import PayloadAnalytics from './section.payload-analytics'
import Scores from './section.scores'

export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <main className="p-10 flex gap-4">
      <PayloadAnalytics />
      <Scores />
      <ScoreMap />
      <Overview />
    </main>
  )
}
