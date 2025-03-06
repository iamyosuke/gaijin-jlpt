import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { SignOut } from "../components/signout-button"
import CustomerPortalButton from "../components/CustomerPortalButton"
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
  const session = await auth()
  const t = await getTranslations('Settings')
  
  if (!session || !session.user) {
    redirect("/login"
    )
  }

  // // メール送信関数
  // try {
  //   await sendMail(session.user.email as string, "テストメール", "これはテストメールです。");
  // } catch (error) {
  //   console.error('エラーが発生しました: ', error);
  // }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('user_settings')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('profile_information')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>{t('name')}:</strong> {session.user.name}
            </p>
            <p>
              <strong>{t('email')}:</strong> {session.user.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('application_settings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminder">{t('daily_reminder')}</Label>
              <Switch id="daily-reminder" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects">{t('sound_effects')}</Label>
              <Switch id="sound-effects" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('account_management')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline">{t('change_password')}</Button>
            <SignOut />
            <CustomerPortalButton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

