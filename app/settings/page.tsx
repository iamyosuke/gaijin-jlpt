import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { SignOut } from "../components/signout-button"
import CustomerPortalButton from "../components/CustomerPortalButton"

export default async function SettingsPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ユーザー設定</h1>
      <Card>
        <CardHeader>
          <CardTitle>プロフィール情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>名前:</strong> {session.user.name}
            </p>
            <p>
              <strong>メール:</strong> {session.user.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>アプリケーション設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminder">デイリーリマインダー</Label>
              <Switch id="daily-reminder" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects">効果音</Label>
              <Switch id="sound-effects" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>アカウント管理</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline">パスワードを変更</Button>
            <SignOut />
            <CustomerPortalButton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

