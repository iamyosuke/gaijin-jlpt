import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SignOut } from '../components/signout-button'

export default async function SettingsPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">ユーザー設定</h1>
      <div className="mb-4">
        <p><strong>名前:</strong> {session.user.name}</p>
        <p><strong>メール:</strong> {session.user.email}</p>
      </div>
      <SignOut />
    </div>
  )
}
