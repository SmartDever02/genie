import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const apiKey = request.headers.get('api-key')
    const SECRET_KEY = process.env.API_TOKEN

    // Validate API key
    if (!apiKey || apiKey !== SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const taskId = params.taskId
    const hash = await prisma.imagehash.findUnique({
      where: {
        taskId,
      },
    })

    if (!hash) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const htmlIndex = hash.htmlIndex

    const map = await prisma.maps.findFirst({
      where: {
        htmlIndex: Number(htmlIndex),
      },
    })

    if (!map) {
      // Can't find map generated
      // Check payloads
      const payloads = await prisma.payloads.findMany({
        where: {
          htmlIndex: Number(htmlIndex),
        },
      })

      if (payloads.length < 1) {
        return NextResponse.json(
          { error: 'No html payloads found' },
          { status: 404 }
        )
      }

      const randomPayload =
        payloads[Math.floor(Math.random() * payloads.length)]

      return NextResponse.json({
        success: true,
        hasMap: false,
        data: randomPayload.content,
      })
    }

    // if there is a map
    const subIndex = map.indexes[0]

    const payloads = await prisma.payloads.findMany({
      where: {
        htmlIndex: Number(htmlIndex),
        variantIndex: subIndex,
      },
    })

    return NextResponse.json({
      success: true,
      hasMap: !!payloads[subIndex]?.content,
      data: payloads[subIndex]?.content || payloads[0].content,
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
