import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Trophy } from "lucide-react"
import { AnswerStatus } from "./components/Flashcard"
import { getLevels } from "@/lib/levels"

export default async function Home() {
  const session = await auth()

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>ログインが必要です</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">このページを表示するにはログインしてください。</p>
            <Button asChild className="w-full">
              <Link href="/login">ログインページへ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const levels = await getLevels()
  console.log(levels)
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Learning Levels</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((level) => {
          const totalWords = level.words.length
          
          const learnedWords = level.words.filter(
            (word) => word.wordStatus.some((status) => status.status === AnswerStatus.Correct)
          ).length
          const progress = totalWords > 0 ? (learnedWords / totalWords) * 100 : 0
          return (
            <Link key={level.id} href={`/level/${level.id}`}>
              <Card className="h-full transition-transform hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Level {level.order}</span>
                    {progress === 100 && <Trophy className="text-yellow-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl mb-2">{level.name}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {learnedWords} / {totalWords} words learned
                  </p>
                  <Progress value={progress} className="h-2" />
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{totalWords} words</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

