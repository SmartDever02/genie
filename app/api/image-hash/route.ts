import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const Schema = z.object({
  htmlIndex: z.number(),
  hash: z.string(),
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

    const { htmlIndex, hash } = parsedData.data

    if (!hash) {
      return NextResponse.json(
        { error: "Bad request: hash shouldn't be empty" },
        { status: 400 }
      )
    }

    const newHash = await prisma.imagehash.create({
      data: {
        htmlIndex,
        imageHash: hash,
      },
    })

    return NextResponse.json({ success: true, data: newHash })
  } catch (error) {
    console.error('Error updating params:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
