import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BookOpen, Layers, Settings } from "lucide-react"
import Link from "next/link"
import Footer from "./components/Footer"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Language Learning Flashcards",
  description: "Learn languages with flashcards",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-500 min-h-screen`}>
        <SessionProvider>
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}

