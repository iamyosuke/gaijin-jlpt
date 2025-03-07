import { NextResponse } from 'next/server'
import { prisma } from '@/prisma'

export async function GET() {
  const levels = await prisma.level.findMany({
    include: {
      words: {
        include: {
          examples: {
            include: {
              meanings: true,
            },
          },
          meanings: true,
        },
      },
    },
  })
  return NextResponse.json(levels)
} 