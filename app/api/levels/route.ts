import { NextResponse } from 'next/server'
import { prisma } from '@/prisma'

export async function GET() {
  const levels = await prisma.level.findMany({
    include: {
      words: {
        include: {
          examples: true,
        },
      },
    },
  })

  return NextResponse.json(levels)
} 