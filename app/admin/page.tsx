'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      alert('データが正常にアップロードされました。')
      router.push('/')
    } else {
      setError('アップロードに失敗しました。')
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
    </div>
  )
} 