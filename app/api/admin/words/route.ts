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
    columns: ['levelId', 'kanji', 'furigana', 'romaji', 'meaningEn', 'examples_sentence', 'examples_meaningEn'],
    skip_empty_lines: true,
  })

  for (const record of records) {
    try {
      await prisma.word.create({
        data: {
          levelId: parseInt(record.levelId),
          kanji: record.kanji,
          furigana: record.furigana,
          romaji: record.romaji,
        meaningEn: record.meaningEn,
        audioUrl: null, // CSVファイルにaudioUrlが含まれないため、nullを設定
        examples: {
          create: [{
            sentence: record.examples_sentence,
            meaningEn: record.examples_meaningEn,
            audioUrl: null, // CSVファイルにaudioUrlが含まれないため、nullを設定
          }],
        },
      },
    })
    } catch (error) {
    }
  }


  return NextResponse.json({ success: true })
} 