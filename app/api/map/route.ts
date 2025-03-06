import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateScoreMap } from '@/service/generate-score-map'
import { ChallengeType } from '@prisma/client'
import { z } from 'zod'

export const maxDuration = 60;

const Schema = z.object({
  min: z.number(),
  max: z.number(),
})

export async function POST(req: Request) {
  try {
    const jsonData = await req.json()
    const parsedData = Schema.safeParse(jsonData)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      )
    }

    const { min, max } = parsedData.data

    const scores = await prisma.scores.findMany({
      where: {
        htmlIndex: {
          gte: min,
          lte: max,
        },
      },
    })

    Promise.all(
      scores.map((score) =>
        generateScoreMap(score.htmlIndex, ChallengeType.ACCURACY)
      )
    )

    return NextResponse.json({
      success: true,
      length: scores.length,
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
