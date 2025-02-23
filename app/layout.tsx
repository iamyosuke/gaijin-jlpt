import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { SessionProvider } from "next-auth/react"
import Footer from "./components/Footer"
import { ThemeProvider } from "@/components/ui/theme-provider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Language Learning App",
  description: "Learn languages with flashcards",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <div className="min-h-screen  bg-background">
              <main className="container mx-auto p-4">{children}</main>
            </div>
            <Footer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

