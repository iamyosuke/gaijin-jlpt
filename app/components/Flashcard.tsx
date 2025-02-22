"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, X, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Word, Status, Example } from "@prisma/client"
import { motion, AnimatePresence } from "framer-motion"

interface FlashcardProps {
  levelId: string
}

export enum AnswerStatus {
  Correct = "learned",
  Incorrect = "learning",
  Skip = "skip",
}

const getFlashcardData = async (id: string) => {
  const response = await fetch(`/api/v1/level/${id}`)
  const data = await response.json()
  return data
}

const updateWordStatus = async (wordId: number, isCorrect: boolean) => {
  await fetch("/api/v1/word-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wordId, isCorrect }),
  })
}

export default function Flashcard({ levelId }: FlashcardProps) {
  const [words, setWords] = useState<(Word & { examples: Example[]; wordStatus: { status: Status }[] })[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFlashcardData(levelId)
        setWords(data.words)
      } catch (error) {
        console.error("Failed to fetch flashcard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [levelId])

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

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.kanji || currentWord.furigana)
    utterance.lang = "ja-JP"
    speechSynthesis.speak(utterance)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  if (words.length === 0) {
    return <div className="flex justify-center items-center h-full">No words found for this level.</div>
  }

  return (
    <div className="flex flex-col h-full">
      <Progress value={words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0} className="w-full" />
      <div className="flex-1 flex flex-col p-4">
        <div className="w-full mb-4 flex justify-between items-center">
          <Button variant="ghost" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {words.length}
          </span>
          <Button
            variant="ghost"
            onClick={() => handleNext(AnswerStatus.Skip)}
            disabled={currentIndex === words.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex items-center justify-center"
          >
            <Card
              className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer overflow-auto"
              onClick={handleCardClick}
            >
              <CardContent className="text-center space-y-4">
                <h2 className="text-4xl sm:text-6xl mb-4">{currentWord.kanji || currentWord.furigana}</h2>
                <div className="space-y-1">
                  <p className="text-lg">{currentWord.furigana}</p>
                  <p className="text-lg text-muted-foreground">{currentWord.romaji}</p>
                </div>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xl sm:text-2xl font-medium">{currentWord.meaningEn}</p>
                    {currentWord.examples && currentWord.examples.length > 0 && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        {currentWord.examples.map((example) => (
                          <div key={example.id} className="mb-4">
                            <p className="text-base sm:text-lg mb-2">{example.sentence}</p>
                            <p className="text-sm text-muted-foreground">{example.meaningEn}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          size="lg"
          variant="destructive"
          className="rounded-full w-16 h-16"
          onClick={() => handleNext(AnswerStatus.Incorrect)}
        >
          <X className="h-8 w-8" />
        </Button>
        <Button size="lg" variant="outline" className="rounded-full w-16 h-16" onClick={speakWord}>
          <Volume2 className="h-8 w-8" />
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
    </div>
  )
}

