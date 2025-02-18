import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // 非同期で解決
  const levelId = resolvedParams.id; // 解決されたparamsを使用
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const level = await prisma.level.findUnique({
    where: { id: parseInt(levelId, 10) },
    include: {
      words: {
        include: {
          examples: true,
          wordStatus: {
            where: {
              userId: session.user.id
            }
          },
        },
      },
    },
  });

  if (!level) {
    return NextResponse.json({ error: 'Level not found' }, { status: 404 });
  }

  return NextResponse.json(level);
}
