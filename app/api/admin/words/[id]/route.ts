import { NextResponse } from 'next/server'
import { prisma } from '@/prisma'

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const wordId = parseInt(url.pathname.split('/').pop() || '')

  if (isNaN(wordId)) {
    return NextResponse.json({ error: 'Invalid word ID' }, { status: 400 })
  }

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.word.delete({
        where: { id: wordId },
      })

    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete word and related records' }, { status: 500 })
  }
} 