import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const Schema = z.object({
  ground_html_index: z.number(),
  accuracy_scores: z.array(z.number()),
  seo_scores: z.array(z.number()),
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

    const { ground_html_index, accuracy_scores, seo_scores } = parsedData.data

    const item = await prisma.scores.upsert({
      where: {
        groundTruthHtmlIndex_htmlIndex: {
          groundTruthHtmlIndex: ground_html_index,
          htmlIndex: Number(params.htmlIndex),
        },
      },
      update: {
        visualScores: accuracy_scores,
        lighthouseScores: seo_scores,
        updatedAt: new Date(),
      },
      create: {
        groundTruthHtmlIndex: ground_html_index,
        htmlIndex: Number(params.htmlIndex),
        visualScores: accuracy_scores,
        lighthouseScores: seo_scores,
      },
    })

    return NextResponse.json({
      success: true,
      item,
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
