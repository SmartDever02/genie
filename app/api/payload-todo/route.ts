import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const TOTAL_HTML_COUNT = 484

export async function GET() {
  try {
    const result = await prisma.payloads.groupBy({
      by: ['htmlIndex'],
      _count: {
        variantIndex: true,
      },
      orderBy: {
        htmlIndex: 'asc',
      },
    })

    const weakPayloadIndexes = result.filter(
      (item) => item._count.variantIndex < 24
    ).map((item) => item.htmlIndex)

    const indexes = result.map((item) => item.htmlIndex)

    const allNumbers = Array.from({ length: TOTAL_HTML_COUNT }, (_, i) => i + 1)
    const missingIndexes = allNumbers.filter(
      (index) => !indexes.includes(index)
    )

    return NextResponse.json({
      success: true,
      data: missingIndexes,
      weakPayloadIndexes: [...missingIndexes, ...weakPayloadIndexes],
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
