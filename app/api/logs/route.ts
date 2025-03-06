import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { LogType } from '@prisma/client'

const Schema = z.object({
  challengeType: z.string().optional(),
  imageHash: z.string().optional(),
  taskId: z.string(),
  logType: z.enum([LogType.SYNAPSE]),
})

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('api-key')
    const SECRET_KEY = process.env.API_TOKEN

    const jsonData = await req.json()
    const parsedData = Schema.safeParse(jsonData)

    // Validate API key
    if (!apiKey || apiKey !== SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      )
    }

    const { challengeType, imageHash, logType, taskId } = parsedData.data

    const payload = await prisma.imagehash.findUnique({
      where: {
        taskId,
      },
    })

    const payloadLength = payload?.htmlIndex
      ? await prisma.payloads.count({
          where: {
            htmlIndex: payload?.htmlIndex,
          },
        })
      : 0

    const expectedScore = payload?.htmlIndex
      ? (
          await prisma.maps.findFirst({
            where: {
              htmlIndex: Number(payload?.htmlIndex),
            },
          })
        )?.avgScores?.at(0) || 0
      : 0
      
    const log = await prisma.logs.create({
      data: {
        challengeType,
        logType,
        imageHash,
        taskId,
        htmlIndex: payload?.htmlIndex || undefined,
        currentPayloadCount: payloadLength,
        expectedScore,
        timestamp: new Date(),
      },
    })

    return NextResponse.json({ success: true, data: log })
  } catch (error) {
    console.error('Error updating params:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
