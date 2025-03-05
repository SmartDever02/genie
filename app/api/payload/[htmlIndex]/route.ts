import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { GPTModel } from '@prisma/client'

export async function GET(
  request: Request,
  { params }: { params: { htmlIndex: string } }
) {
  try {
    const apiKey = request.headers.get('api-key')
    const model = (request.headers.get('gpt-model') ||
      GPTModel.GPT4o) as GPTModel
    const SECRET_KEY = process.env.API_TOKEN

    // Validate API key
    if (!apiKey || apiKey !== SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const htmlIndex = params.htmlIndex
    const payloads = await prisma.payloads.findMany({
      where: {
        htmlIndex: Number(htmlIndex),
        model,
      },
    })

    return NextResponse.json({
      success: true,
      length: payloads.length,
      data: payloads,
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
