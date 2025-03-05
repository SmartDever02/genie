import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const result = await prisma.payloads.groupBy({
      by: ['htmlIndex'],
      orderBy: {
        htmlIndex: 'asc',
      },
    })

    const payloadIndexes = result.map((item) => item.htmlIndex)

    const scores = await prisma.scores.findMany({
      orderBy: {
        htmlIndex: 'asc',
      },
    })

    const scoreIndexes = scores.map((score) => score.htmlIndex)

    const missingIndexes = payloadIndexes.filter(
      (index) => !scoreIndexes.includes(index)
    )

    return NextResponse.json({
      success: true,
      missingIndexes,
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
