'use client'

import { useEffect, useState } from 'react'
import { prisma } from '@/prisma'
import type { Word, UserWordStatus } from '@prisma/client'

interface WordWithStatus extends Word {
  wordStatus: UserWordStatus[];
}

export default function WordsPage() {
  const [words, setWords] = useState<WordWithStatus[]>([])

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch('/api/v1/words')
      const data = await response.json()
      setWords(data)
    }
    fetchWords()
  }, [])
  console.log(words)

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">単語一覧</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">単語</th>
            <th className="py-2">学習ステータス</th>
            <th className="py-2">正解数</th>
            <th className="py-2">不正解数</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => {
            const status = word.wordStatus[0] || {};
            return (
              <tr key={word.id}>
                <td className="border px-4 py-2">{word.kanji || word.furigana}</td>
                <td className="border px-4 py-2">{status.status || '未学習'}</td>
                <td className="border px-4 py-2">{status.correctCount || 0}</td>
                <td className="border px-4 py-2">{status.incorrectCount || 0}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
