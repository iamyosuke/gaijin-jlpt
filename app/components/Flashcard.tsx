"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, X, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Word, Example, Meaning } from "@prisma/client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTranslations } from 'next-intl';

interface FlashcardProps {
  levelId: string
}
interface ExampleWithMeanings extends Example {
  meanings: Meaning[]
}
interface WordWithMeanings extends Word {
  examples: ExampleWithMeanings[]
  meanings: Meaning[]
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

const processData = (data: string[]) => {
  if (data[0] === "levelId,text,furigana,romaji,meaning_en,examples_sentence,examples_mean") {
    data.shift(); // 一行目をスキップ
  }
  // ... existing code to process data ...
}

export default function Flashcard({ levelId }: FlashcardProps) {
  const t = useTranslations('Flashcard')
  const [words, setWords] = useState<WordWithMeanings[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
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
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.text || currentWord.furigana || "")
    utterance.lang = "ja-JP"
    speechSynthesis.speak(utterance)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">{t('loading')}</div>
  }

  if (words.length === 0) {
    return <div className="flex justify-center items-center h-full">{t('no_words_found')}</div>
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

        <div className="flex-1 flex items-center justify-center perspective-1000">
          <motion.div
            className="w-full h-full relative"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleCardClick}
          >
            <Card
              className={`w-full h-full absolute cursor-pointer ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
              onClick={handleCardClick}
            >
              <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                {!isFlipped ? (
                  <>
                    <h2 className="text-4xl sm:text-6xl mb-4">{currentWord.text || currentWord.furigana}</h2>
                    <div className="space-y-1">
                      <p className="text-lg">{currentWord.furigana}</p>
                      <p className="text-lg text-muted-foreground">{currentWord.romaji}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xl sm:text-2xl font-medium mb-4">{currentWord.meanings[0].meaning}</p>
                    {currentWord.imageUrl && (
                      <div className="w-full max-w-xs h-48 mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={currentWord.imageUrl || "/placeholder.svg"}
                          alt={currentWord.text || currentWord.furigana || ""}
                          layout="responsive"
                          width={100}
                          height={100}
                          objectFit="cover"
                        />
                      </div>
                    )}
                    {currentWord.examples && currentWord.examples.length > 0 && (
                      <div className="w-full mt-4 p-4 bg-muted rounded-lg">
                        {currentWord.examples.map((example) => (
                          <div key={example.id} className="mb-4">
                            <p className="text-base sm:text-lg mb-2">{example.sentence}</p>
                            <p className="text-sm text-muted-foreground">{example.meanings[0].meaning}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

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

