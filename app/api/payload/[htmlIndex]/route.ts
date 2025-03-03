import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const MinerSchema = z.object({
  htmlIndex: z.number(),
  content: z.string(),
})

export async function GET(
  request: Request,
  { params }: { params: { htmlIndex: string } }
) {
  try {
    const jsonData = await request.json()
    const parsedData = MinerSchema.safeParse(jsonData)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      )
    }

    const htmlIndex = params.htmlIndex
    const payloads = await prisma.payloads.findMany({
      where: {
        htmlIndex: Number(htmlIndex),
      },
    })

    return NextResponse.json({ success: true, data: payloads })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
