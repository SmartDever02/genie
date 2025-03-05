import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateScoreMap } from '@/service/generate-score-map'
import { ChallengeType } from '@prisma/client'

export async function GET() {
  try {
    const scores = await prisma.scores.groupBy({
      by: ['htmlIndex'],
      _count: {
        groundTruthHtmlIndex: true,
      },
      orderBy: {
        htmlIndex: 'asc',
      },
    })

    await Promise.all(
      scores.map((score) =>
        generateScoreMap(score.htmlIndex, ChallengeType.ACCURACY)
      )
    )

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
