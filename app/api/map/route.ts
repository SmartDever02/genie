import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateScoreMap } from '@/service/generate-score-map'
import { ChallengeType } from '@prisma/client'

export async function POST() {
  try {
    const scores = await prisma.scores.findMany({
      orderBy: {
        'updatedAt': 'asc'
      },
      take: 300
    })

    Promise.all(
      scores.map((score) =>
        generateScoreMap(score.htmlIndex, ChallengeType.ACCURACY)
      )
    )

    return NextResponse.json({
      success: true,
      length: scores.length
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
