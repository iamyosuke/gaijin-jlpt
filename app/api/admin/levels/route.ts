import { prisma } from "@/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, order } = await request.json()
    const level = await prisma.level.create({
      data: {
        name,
        order,
      },
    })
    return NextResponse.json(level)
  } catch (error) {
    return NextResponse.json({ error: "レベルの作成に失敗しました" }, { status: 500 })
  }
}

