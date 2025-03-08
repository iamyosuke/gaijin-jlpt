import Flashcard from "@/app/components/Flashcard"
import type { Word, Status } from "@prisma/client"

export interface FlashcardProps {
  words: (Word & {
    examples: { sentence: string; meaningEn: string }[]
    wordStatus: { status: Status }[]
  })[]
}

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params // 非同期で解決

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold p-4">{resolvedParams.id}</h1>
      <div className="flex-1 overflow-hidden">
        <Flashcard levelId={resolvedParams.id} />
      </div>
    </div>
  )
}


