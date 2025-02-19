import { prisma } from "@/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const levels = await request.json()

    // Transaction to update all levels at once
    await prisma.$transaction(
      levels.map((level: { id: number; order: number }) =>
        prisma.level.update({
          where: { id: level.id },
          data: { order: level.order },
        }),
      ),
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "レベルの並び替えに失敗しました" }, { status: 500 })
  }
}

