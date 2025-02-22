'use client'
import Link from "next/link"
import { BookOpen, Layers, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()
  if (pathname.includes('/level')) {
    return null
  }
  return (
    <footer className="sticky bottom-0 border-t bg-white py-4">
      <div className="container max-w-md mx-auto flex justify-around items-center">
        <Link href="/words" className={`flex flex-col items-center gap-1 ${pathname === '/words' ? 'text-blue-500' : 'text-gray-500'}`}>
          <BookOpen className="h-6 w-6" />
          <span className="text-xs">Words</span>
        </Link>
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`}>
          <Layers className="h-6 w-6" />
          <span className="text-xs">Learn</span>
        </Link>
        <Link href="/settings" className={`flex flex-col items-center gap-1 ${pathname === '/settings' ? 'text-blue-500' : 'text-gray-500'}`}>
          <Settings className="h-6 w-6" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </footer>
  )
} 