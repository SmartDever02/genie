import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateScoreMap } from '@/service/generate-score-map'

const Schema = z.object({
  type: z.enum(['ACCURACY', 'LIGHTHOUSE', 'BALANCED']),
})

export async function POST(
  request: Request,
  { params }: { params: { htmlIndex: string } }
) {
  try {
    const jsonData = await request.json()
    const parsedData = Schema.safeParse(jsonData)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      )
    }

    const apiKey = request.headers.get('api-key')
    const SECRET_KEY = process.env.API_TOKEN

    // Validate API key
    if (!apiKey || apiKey !== SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = parsedData.data

    const { maxAvg, maxIdx, visualScores } = await generateScoreMap(
      Number(params.htmlIndex),
      type
    )

    return NextResponse.json({
      success: true,
      position: maxIdx,
      topAverage: maxAvg,
      scores: visualScores.map((subArray) => subArray[maxIdx]),
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
