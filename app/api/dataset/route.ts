import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const Schema = z.object({
  htmlIndex: z.number(),
  content: z.string(),
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

    const { htmlIndex, content } = parsedData.data

    if (!content) {
      return NextResponse.json(
        { error: "Bad request: content shouldn't be empty" },
        { status: 400 }
      )
    }

    const newPayload = await prisma.datasets.create({
      data: {
        htmlIndex,
        content: content.replace('{"complex_html":"', '').replace(/"}$/, ''),
      },
    })

    return NextResponse.json({ success: true, data: newPayload })
  } catch (error) {
    console.error('Error updating params:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
