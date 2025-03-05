import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { ChallengeType } from '@prisma/client'

const Schema = z.object({
  challenge_type: z.enum([
    ChallengeType.ACCURACY,
    ChallengeType.BALANCED,
    ChallengeType.LIGHTHOUSE,
  ]),
})

export async function POST(
  request: Request,
  { params }: { params: { hash: string } }
) {
  try {
    const jsonData = await request.json()
    const parsedData = Schema.safeParse(jsonData)

    const apiKey = request.headers.get('api-key')
    const SECRET_KEY = process.env.API_TOKEN

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      )
    }

    // Validate API key
    if (!apiKey || apiKey !== SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { challenge_type } = parsedData.data

    const imageHash = params.hash

    const hash = await prisma.imagehash.findFirstOrThrow({
      where: {
        imageHash,
      },
    })

    const htmlIndex = hash.htmlIndex

    const map = await prisma.maps.findFirst({
      where: {
        htmlIndex: Number(htmlIndex),
        challangeType: challenge_type
      },
    })

    if (!map) {
      return NextResponse.json(
        { error: 'Not found for the image hash' },
        { status: 404 }
      )
    }

    const bestSubIndex = map.indexes[0]
    const bestPaylaod = await prisma.payloads.findFirst({
      where: {
        htmlIndex: Number(htmlIndex),
        variantIndex: bestSubIndex,
      },
    })

    if (!bestPaylaod) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: bestPaylaod.content,
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
