import { prisma } from "@/prisma"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.level.delete({
      where: {
        id: Number.parseInt(params.id),
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "レベルの削除に失敗しました" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await request.json()
    const level = await prisma.level.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        name,
      },
    })
    return NextResponse.json(level)
  } catch (error) {
    return NextResponse.json({ error: "レベルの更新に失敗しました" }, { status: 500 })
  }
}