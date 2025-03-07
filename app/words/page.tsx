"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import type { Word, UserWordStatus } from "@prisma/client"

interface WordWithStatus extends Word {
  wordStatus: UserWordStatus[]
}

export default function WordsPage() {
  const [words, setWords] = useState<WordWithStatus[]>([])
  const [filteredWords, setFilteredWords] = useState<WordWithStatus[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch("/api/v1/words")
      const data = await response.json()
      setWords(data)
      setFilteredWords(data)
    }
    fetchWords()
  }, [])

  useEffect(() => {
    const filtered = words.filter(
      (word) =>
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.furigana?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaningEn?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredWords(filtered)
  }, [searchTerm, words])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LEARNED":
        return "bg-green-500"
      case "LEARNING":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">単語一覧</h1>
      <Input
        type="text"
        placeholder="Search words..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWords.map((word) => {
          const status = word.wordStatus[0] || {}
          const totalAttempts = (status.correctCount || 0) + (status.incorrectCount || 0)
          const correctPercentage = totalAttempts > 0 ? ((status.correctCount || 0) / totalAttempts) * 100 : 0

          return (
            <Card key={word.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{word.word || word.furigana}</span>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(status.status || "")}`}>
                    {status.status || "未学習"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-2">{word.meaningEn}</p>
                <p className="text-sm text-muted-foreground mb-4">{word.furigana}</p>
                <Progress value={correctPercentage} className="h-2" />
                <div className="mt-2 text-sm text-muted-foreground">
                  正解率: {correctPercentage.toFixed(0)}% ({status.correctCount || 0}/{totalAttempts})
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

