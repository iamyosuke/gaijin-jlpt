import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
  console.log("POST /api/v1/word-status");
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
  }
    
  const { wordId, isCorrect } = await request.json();
  console.log(wordId, isCorrect);
  const userWordStatus = await prisma.userWordStatus.findFirst({
    where: {
      userId: session.user.id,
      wordId: wordId,
    },
  });

  if (userWordStatus) {
    await prisma.userWordStatus.update({
      where: {
        id: userWordStatus.id,
      },
      data: {
        correctCount: isCorrect ? userWordStatus.correctCount + 1 : userWordStatus.correctCount,
        incorrectCount: !isCorrect ? userWordStatus.incorrectCount + 1 : userWordStatus.incorrectCount,
        lastReview: new Date(),
        status: isCorrect ? 'learned' : 'learning',
      },
    });
  } else {
    await prisma.userWordStatus.create({
      data: {
        userId: session.user.id as string,
        wordId: wordId,
        status: isCorrect ? 'learned' : 'learning',
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: !isCorrect ? 1 : 0,
        lastReview: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
} 