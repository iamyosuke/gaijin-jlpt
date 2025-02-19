import { prisma } from "@/prisma"
import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function Home() {
  const session = await auth()

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="mb-4 text-gray-600">このページを表示するにはログインしてください。</p>
          <Button asChild className="w-full">
            <Link href="/login">ログインページへ</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const levels = await prisma.level.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 container max-w-md mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Learning Levels</h1>
        <div className="space-y-4">
          {levels.map((level, index) => (
            <Link key={level.id} href={`/level/${level.id}`}>
              <Card
                className={`p-6 transition-transform hover:scale-[1.02] ${
                  index === 0 ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
                }`}
              >
                <h2 className="text-2xl font-bold text-center mb-2">Level {level.order}</h2>
                <p className="text-xl text-center mb-1">{index === 0 ? "Beginner" : "Elementary"}</p>
                <p className="text-center text-sm opacity-90">
                  {index === 0 ? "Basic everyday words" : "Common expressions"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </main>

  
    </div>
  )
}

