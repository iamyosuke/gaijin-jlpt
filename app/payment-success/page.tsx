"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount")

  useEffect(() => {
    // 必要に応じて、ここで支払い成功後の処理を追加できます
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex flex-col items-center">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            支払いが成功しました！
          </CardTitle>
        </CardHeader>
        <CardContent>
          {amount && (
            <p className="text-center text-xl font-semibold mb-4">
              支払金額: {Number.parseInt(amount).toLocaleString()}円
            </p>
          )}
          <p className="text-center text-muted-foreground">ご利用ありがとうございます。</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">ホームに戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

