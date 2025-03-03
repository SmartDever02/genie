import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const MinerSchema = z.object({
  htmlIndex: z.number(),
  content: z.string(),
})

export async function POST(req: Request) {
  try {
    const jsonData = await req.json()
    const parsedData = MinerSchema.safeParse(jsonData)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      )
    }

    const { htmlIndex, content } = parsedData.data

    console.log('html index', htmlIndex)

    const variantCount = await prisma.payloads.count({
      where: {
        htmlIndex,
      },
    })

    console.log('variant count: ', variantCount)

    const newPayload = await prisma.payloads.create({
      data: {
        htmlIndex,
        content,
        variantIndex: variantCount,
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

// export async function DELETE(req: Request) {
//   try {
//     const { uid, id } = await req.json();

//     if (!uid || !id) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const deletedMiner = await prisma.params.delete({
//       where: { uid, id },
//     });

//     return NextResponse.json({ success: true, data: deletedMiner });
//   } catch (error) {
//     console.error("Error updating params:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
