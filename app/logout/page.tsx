'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      await signOut({ redirect: false })
      router.push('/login') // ログアウト後にリダイレクトするページ
    }

    performLogout()
  }, [router])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ログアウト中...</h1>
    </div>
  )
} 