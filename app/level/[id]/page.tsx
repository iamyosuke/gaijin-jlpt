import { prisma } from "@/prisma"
import Flashcard from '@/app/components/Flashcard';
import { Word, Status } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from '@/auth';

export interface FlashcardProps {
  words: (Word & { 
    examples: { sentence: string; meaningEn: string }[]; 
    wordStatus: { status: Status }[]
  })[]
}

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // 非同期で解決
  const session = await auth(); // ユーザーIDを取得する方法に応じて修正

  if (!session?.user) {
    return redirect('/login');
  }

  const level = await prisma.level.findUnique({
    where: { id: parseInt(resolvedParams.id, 10) }, // 解決されたparamsを使用
    include: {
      words: {
        include: {
          examples: true,
          wordStatus: {
            where: {
              userId: session.user.id // 現在のユーザーのIDを使用
            }
          },
        },
      },
    },
  });

  if (!level) {
    return <div>レベルが見つかりません</div>;
  }

  const words = level.words.map(word => ({
    ...word,
    examples: word.examples.map(example => ({
      sentence: example.sentence,
      meaningEn: example.meaningEn
    })),
    wordStatus: word.wordStatus.map(status => ({
      status: status.status as Status
    }))
  }));

  if (words.length === 0) {
    return <div>このレベルには単語がありません</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{level.name}</h1>
      <Flashcard words={words as FlashcardProps['words']} />
    </div>
  );
}