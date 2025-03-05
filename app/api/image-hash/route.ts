import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const Schema = z.object({
  htmlIndex: z.number(),
  hash: z.string(),
  taskId: z.string(),
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

    const { htmlIndex, hash, taskId } = parsedData.data

    if (!hash || !taskId) {
      return NextResponse.json(
        { error: "Bad request: hash shouldn't be empty" },
        { status: 400 }
      )
    }

    const newHash = await prisma.imagehash.upsert({
      where: { htmlIndex }, // Check if htmlIndex exists
      update: { imageHash: hash, taskId }, // Update imageHash if found
      create: { htmlIndex, imageHash: hash, taskId }, // Create new record if not found
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
