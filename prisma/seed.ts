import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Languageモデルのシードデータを作成
  const languages = [
    { code: 'en', name: 'English', nameEn: 'English', order: 10 },
    { code: 'ja', name: '日本語', nameEn: 'Japanese', order: 20 }, 
    { code: 'es', name: 'Español', nameEn: 'Spanish', order: 30 },
    { code: 'fr', name: 'Français', nameEn: 'French', order: 40 },
    { code: 'de', name: 'Deutsch', nameEn: 'German', order: 50 },
    { code: 'it', name: 'Italiano', nameEn: 'Italian', order: 60 },
    { code: 'pt', name: 'Português', nameEn: 'Portuguese', order: 70 },
    { code: 'ru', name: 'Русский', nameEn: 'Russian', order: 80 },
    { code: 'ar', name: 'العربية', nameEn: 'Arabic', order: 90 },
    // 必要に応じて他の言語を追加
  ]

  const levels = [
    { id: 1, name: 'N5', order: 10 },
    { id: 2, name: 'N4', order: 20 },
    { id: 3, name: 'N3', order: 30 },
    { id: 4, name: 'N2', order: 40 },
    { id: 5, name: 'N1', order: 50 },
  ]

  // データベースにシードデータを挿入
  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: {},
      create: language,
    })
  }

  for (const level of levels) { 
    await prisma.level.upsert({
      where: { id: level.id },
      update: {},
      create: level,
    })
  }

  const words = [
    {  
      levelId: 1, 
      text: '水', 
      furigana: 'みず', 
      romaji: 'mizu', 
      examples: [
        { 
          sentence: '水を飲む',
          meanings: [
            { meaning: 'Drink water', code: 'en' },
            { meaning: 'Beber agua', code: 'es' },
            { meaning: 'Boire de l\'eau', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'water', code: 'en' },
        { meaning: 'agua', code: 'es' },
        { meaning: 'eau', code: 'fr' },
      ]
    },
  ]
  
  for (const word of words) {
    await prisma.word.create({
      data: {
        ...word,
        meanings: {
          create: word.meanings.map(meaning => ({
            ...meaning,
            language: {
              connect: { code: meaning.code },
            },
          })),
        },
        examples: {
          create: word.examples.map(example => ({
            ...example,
            meanings: {
              create: example.meanings,
            }
          })),
        },
      },
    })
  }

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 