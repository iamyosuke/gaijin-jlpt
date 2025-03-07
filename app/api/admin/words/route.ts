import { NextResponse } from 'next/server'
import { prisma } from '@/prisma'
import { parse } from 'csv-parse/sync'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const text = await file.text()
  const records = parse(text, {
    columns: true,
    // levelId,text,furigana,romaji,meaning_en,examples_sentence,examples_meaning_en
    skip_empty_lines: true,
  })

  for (const record of records) {
    try {
      const wordMeaning = {
        meaning: record.meaning_en,
        language: {
          connect: { code: 'en' },
        },
      }

      const exampleMeaning = {
        meaning: record.examples_meaning_en,
        language: {
          connect: { code: 'en' },
        },
      }
      console.log(record)
      const Word = await prisma.word.findFirst({
        where: {
          text: record.text,
        },
      })

      if (!Word) {
      await prisma.word.create({
        data: {
          levelId: parseInt(record.levelId),
          text: record.text,
          furigana: record.furigana,
          romaji: record.romaji,
          meanings: {
            create: [wordMeaning],
          },
          examples: {
            create: [{
              sentence: record.examples_sentence,
              meanings: {
                create: [exampleMeaning],
              },
            }],
          },
        },
      })
    }


    } catch (error) {
      console.log(error)
    }
  }

  return NextResponse.json({ success: true })
}