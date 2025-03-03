import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const MinerSchema = z.object({
  id: z.number(),
  uid: z.number(),
  dir: z.array(z.number()),
  gap: z.number(),
  index: z.number(),
  owner: z.string(),
});


export async function PUT(req: Request) {
  try {
    const jsonData = await req.json();
    const parsedData = MinerSchema.safeParse(jsonData);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const { uid, dir, gap, index, id, owner } = parsedData.data;

    const updatedRecord = await prisma.params.update({
      where: { uid, id },
      data: {
        dir: dir,
        gap: Number(gap),
        index,
        // @ts-ignore getting enum from the frontend
        owner,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error) {
    console.error("Error updating params:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { uid, id } = await req.json();

    if (!uid || !id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const deletedMiner = await prisma.params.delete({
      where: { uid, id },
    });

    return NextResponse.json({ success: true, data: deletedMiner });
  } catch (error) {
    console.error("Error updating params:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
