import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { SessionProvider } from "next-auth/react"
import Footer from "./components/Footer"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Language Learning App",
  description: "Learn languages with flashcards",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const locale = await getLocale()
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <NextIntlClientProvider messages={messages}>
              <div className="min-h-screen  bg-background">
                <main className="container mx-auto p-4">{children}</main>
              </div>
              <Footer />
            </NextIntlClientProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

