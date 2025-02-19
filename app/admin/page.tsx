"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Grip, Plus, Save, Trash2, Upload } from "lucide-react"
import type { Word, Level, Example } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

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
  const [expandedLevels, setExpandedLevels] = useState<number[]>([])
  const [editingLevel, setEditingLevel] = useState<number | null>(null)
  const [newLevelName, setNewLevelName] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchLevels()
  }, [])

  const fetchLevels = async () => {
    const response = await fetch("/api/levels")
    const data = await response.json()
    setLevels(data)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("ファイルを選択してください。")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/admin/words", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      alert("データが正常にアップロードされました。")
      fetchLevels()
    } else {
      setError("アップロードに失敗しました。")
    }
  }

  const handleDeleteWord = async (wordId: number) => {
    const response = await fetch(`/api/admin/words/${wordId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setLevels((prevLevels) =>
        prevLevels.map((level) => ({
          ...level,
          words: level.words.filter((word) => word.id !== wordId),
        })),
      )
    } else {
      alert("削除に失敗しました。")
    }
  }

  const handleDeleteLevel = async (levelId: number) => {
    if (!confirm("このレベルを削除してもよろしいですか？")) return

    const response = await fetch(`/api/admin/levels/${levelId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setLevels((prevLevels) => prevLevels.filter((level) => level.id !== levelId))
    } else {
      alert("レベルの削除に失敗しました。")
    }
  }

  const handleAddLevel = async () => {
    if (!newLevelName.trim()) return

    const response = await fetch("/api/admin/levels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newLevelName,
        order: levels.length + 1,
      }),
    })

    if (response.ok) {
      const newLevel = await response.json()
      setLevels([...levels, newLevel])
      setNewLevelName("")
    } else {
      alert("レベルの追加に失敗しました。")
    }
  }

  const handleUpdateLevel = async (levelId: number, newName: string) => {
    const response = await fetch(`/api/admin/levels/${levelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })

    if (response.ok) {
      setLevels((prevLevels) => prevLevels.map((level) => (level.id === levelId ? { ...level, name: newName } : level)))
      setEditingLevel(null)
    } else {
      alert("レベルの更新に失敗しました。")
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(levels)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order property for each level
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }))

    setLevels(updatedItems)

    // Update orders in the backend
    const response = await fetch("/api/admin/levels/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItems.map((item) => ({ id: item.id, order: item.order }))),
    })

    if (!response.ok) {
      alert("レベルの並び替えに失敗しました。")
      fetchLevels() // Revert to original order
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">管理画面</h1>
        <div className="flex gap-2">
          <Input type="file" accept=".csv" onChange={handleFileChange} className="max-w-xs" />
          <Button onClick={handleSubmit} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            CSVアップロード
          </Button>
        </div>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="新しいレベル名"
          value={newLevelName}
          onChange={(e) => setNewLevelName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleAddLevel}>
          <Plus className="mr-2 h-4 w-4" />
          レベルを追加
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="levels">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {levels.map((level, index) => (
                <Draggable key={level.id} draggableId={level.id.toString()} index={index}>
                  {(provided) => (
                    <Card ref={provided.innerRef} {...provided.draggableProps} className="border shadow-sm">
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-4">
                          <div {...provided.dragHandleProps}>
                            <Grip className="h-5 w-5 text-muted-foreground" />
                          </div>
                          {editingLevel === level.id ? (
                            <div className="flex gap-2 flex-1">
                              <Input
                                value={level.name}
                                onChange={(e) =>
                                  setLevels(levels.map((l) => (l.id === level.id ? { ...l, name: e.target.value } : l)))
                                }
                              />
                              <Button onClick={() => handleUpdateLevel(level.id, level.name)} size="sm">
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <h3
                              className="text-xl font-semibold flex-1"
                              onDoubleClick={() => setEditingLevel(level.id)}
                            >
                              {level.name}
                            </h3>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setExpandedLevels(
                                  expandedLevels.includes(level.id)
                                    ? expandedLevels.filter((id) => id !== level.id)
                                    : [...expandedLevels, level.id],
                                )
                              }}
                            >
                              {expandedLevels.includes(level.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteLevel(level.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {expandedLevels.includes(level.id) && (
                        <CardContent className="p-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>単語</TableHead>
                                <TableHead>ふりがな</TableHead>
                                <TableHead>ローマ字</TableHead>
                                <TableHead>意味</TableHead>
                                <TableHead>例文</TableHead>
                                <TableHead className="w-[100px]">操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {level.words.map((word) => (
                                <TableRow key={word.id}>
                                  <TableCell>{word.kanji || word.furigana}</TableCell>
                                  <TableCell>{word.furigana}</TableCell>
                                  <TableCell>{word.romaji}</TableCell>
                                  <TableCell>{word.meaningEn}</TableCell>
                                  <TableCell>
                                    {word.examples.map((example) => (
                                      <div key={example.id} className="space-y-1">
                                        <p>{example.sentence}</p>
                                        <p className="text-sm text-muted-foreground">{example.meaningEn}</p>
                                      </div>
                                    ))}
                                  </TableCell>
                                  <TableCell>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteWord(word.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

