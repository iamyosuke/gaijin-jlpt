import { prisma } from "@/prisma"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const levelId = parseInt(url.pathname.split('/').pop() || '')

  if (isNaN(levelId)) {
    return NextResponse.json({ error: 'Invalid level ID' }, { status: 400 })
  }

  try {
    await prisma.level.delete({
      where: { id: levelId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete level' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const url = new URL(request.url)
  const levelId = parseInt(url.pathname.split('/').pop() || '')

  if (isNaN(levelId)) {
    return NextResponse.json({ error: 'Invalid level ID' }, { status: 400 })
  }

  try {
    const { name } = await request.json()
    const level = await prisma.level.update({
      where: { id: levelId },
      data: { name },
    })
    return NextResponse.json(level)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update level" }, { status: 500 })
  }
}