import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const invalidPayloads = await prisma.payloads.findMany({
      where: {
        content: {
          startsWith: '{"complex_html":"',
        },
      },
    })

    for (let i = 0; i < invalidPayloads.length; i++) {
      const content = invalidPayloads[i].content
      const updatedContent = content.replace('{"complex_html":"', '').replace(/"}$/, '');

      await prisma.payloads.update({
        where: {
          id: invalidPayloads[i].id,
        },
        data: {
          content: updatedContent,
        },
      })
    }

    return NextResponse.json({
      success: true,
      length: invalidPayloads.length,
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
