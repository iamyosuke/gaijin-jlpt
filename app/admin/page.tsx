'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Word, Level, Example } from '@prisma/client'

interface WordWithExamples extends Word {
  examples: Example[]
}

interface LevelWithWords extends Level {
  words: WordWithExamples[]
}

export default function AdminPage() {
  const [levels, setLevels] = useState<LevelWithWords[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchLevels = async () => {
      const response = await fetch('/api/levels')
      const data = await response.json()
      setLevels(data)
    }
    fetchLevels()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('ファイルを選択してください。')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/admin/words', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      alert('データが正常にアップロードされました。')
      router.push('/admin/words')
    } else {
      setError('アップロードに失敗しました。')
    }
  }

  const handleDelete = async (wordId: number) => {
    const response = await fetch(`/api/admin/words/${wordId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      // alert('単語が削除されました。')
      setLevels((prevLevels) =>
        prevLevels.map((level) => ({
          ...level,
          words: level.words.filter((word) => word.id !== wordId),
        }))
      )
    } else {
      alert('削除に失敗しました。')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">管理画面</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          アップロード
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <h2 className="text-xl font-semibold mt-8 mb-4">単語一覧</h2>
      {levels.map((level) => (
        <div key={level.id} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{level.name}</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">単語</th>
                <th className="py-2">ふりがな</th>
                <th className="py-2">ローマ字</th>
                <th className="py-2">意味</th>
                <th className="py-2">例文</th>
                <th className="py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {level.words.map((word) => (
                <tr key={word.id}>
                  <td className="border px-4 py-2">{word.kanji || word.furigana}</td>
                  <td className="border px-4 py-2">{word.furigana}</td>
                  <td className="border px-4 py-2">{word.romaji}</td>
                  <td className="border px-4 py-2">{word.meaningEn}</td>
                  <td className="border px-4 py-2">
                    {word.examples.map((example) => (
                      <div key={example.id}>
                        <p>{example.sentence}</p>
                        <p className="text-muted-foreground">{example.meaningEn}</p>
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
} 