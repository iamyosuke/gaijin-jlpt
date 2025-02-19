import { NextResponse } from 'next/server'
import { prisma } from '@/prisma'
import { parse } from 'csv-parse/sync'
import { auth } from '@/auth'

export async function POST(request: Request) {
  const session = await auth()

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const text = await file.text()
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
  })

  for (const record of records) {
    await prisma.word.create({
      data: {
        levelId: parseInt(record.levelId),
        kanji: record.kanji,
        furigana: record.furigana,
        meaningEn: record.meaningEn,
        audioUrl: record.audioUrl || null,
        examples: {
          create: record.examples.split(';').map((example: string) => {
            const [sentence, meaningEn, audioUrl] = example.split(',')
            return { sentence, meaningEn, audioUrl: audioUrl || null }
          }),
        },
      },
    })
  }

  return NextResponse.json({ success: true })
} 