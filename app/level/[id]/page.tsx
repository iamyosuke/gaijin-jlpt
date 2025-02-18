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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{resolvedParams.id}</h1>
      <Flashcard levelId={resolvedParams.id} />
    </div>
  );
}