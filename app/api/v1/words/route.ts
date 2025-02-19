import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const words = await prisma.word.findMany({
    include: {
      wordStatus: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(words);
} 