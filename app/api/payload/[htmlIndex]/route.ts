import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { htmlIndex: string } }
) {
  try {
    const htmlIndex = params.htmlIndex
    const payloads = await prisma.payloads.findMany({
      where: {
        htmlIndex: Number(htmlIndex),
      },
    })

    return NextResponse.json({ success: true, length: payloads.length, data: payloads })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
