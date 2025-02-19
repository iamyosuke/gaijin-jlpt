'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Word, Status } from '@prisma/client'

interface FlashcardProps {
  levelId: string;
}

enum AnswerStatus {
  Correct = "correct",
  Incorrect = "incorrect",
  Skip = "skip"
}

const getFlashcardData = async (id: string) => {
  const response = await fetch(`/api/v1/level/${id}`)
  const data = await response.json()
  return data
}

const updateWordStatus = async (wordId: number, isCorrect: boolean) => {
  await fetch('/api/v1/word-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wordId, isCorrect }),
  })
}

export default function Flashcard({ levelId }: FlashcardProps) {
  const [words, setWords] = useState<(Word & { examples: { sentence: string; meaningEn: string }[]; wordStatus: { status: Status }[] })[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFlashcardData(levelId)
      setWords(data.words)
    }
    fetchData()
  }, [levelId])
  console.log(words);
  const currentWord = words[currentIndex]

  const handleNext = (status: AnswerStatus) => {
    if (status !== AnswerStatus.Skip) {
      updateWordStatus(currentWord.id, status === AnswerStatus.Correct)
    }
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleCardClick = () => {
    setShowAnswer(!showAnswer)
  }

  if (words.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="w-full mb-4 flex justify-between items-center">
        <Button variant="ghost" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {words.length}
        </span>
        <Button variant="ghost" onClick={() => handleNext(AnswerStatus.Skip)} disabled={currentIndex === words.length - 1}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <Card 
        className="w-full aspect-[4/5] flex flex-col items-center justify-center p-6 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="text-center space-y-4">
          <h2 className="text-6xl mb-4">{currentWord.kanji}</h2>
          <div className="space-y-1">
            <p className="text-lg">{currentWord.furigana}</p>
            {/* <p className="text-lg text-muted-foreground">{currentWord.romaji}</p> */}
          </div>
          <p className="text-2xl font-medium">{currentWord.meaningEn}</p>

          {showAnswer && currentWord.examples && currentWord.examples.length > 0 && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-lg mb-2">{currentWord.examples[0].sentence}</p>
              <p className="text-muted-foreground">{currentWord.examples[0].meaningEn}</p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-4 mt-6">
        <Button 
          size="lg" 
          variant="destructive"
          className="rounded-full w-16 h-16"
          onClick={() => handleNext(AnswerStatus.Incorrect)}
        >
          <X className="h-8 w-8" />
        </Button>
        <Button 
          size="lg" 
          variant="default" 
          className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
          onClick={() => handleNext(AnswerStatus.Correct)}
        >
          <Check className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}
