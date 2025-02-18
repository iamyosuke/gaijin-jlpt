import { prisma } from "@/prisma"
import Flashcard from '@/app/components/Flashcard';
import { Word } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from '@/auth';

export default async function LevelPage({ params }: { params: { id: string } }) {

  const session = await auth()// ユーザーIDを取得する方法に応じて修正

  if (!session?.user) {
    return redirect('/login')
  }

  const level = await prisma.level.findUnique({
    where: { id: parseInt(params.id, 10) },
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
  })
  console.log(level)

  if (!level) {
    return <div>レベルが見つかりません</div>
  }

  const words = level.words
  if (words.length === 0) {
    return <div>このレベルには単語がありません</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{level.name}</h1>
      <Flashcard words={words as Word[]} />
    </div>
  )
}