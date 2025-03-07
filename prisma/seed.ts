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
    {  
      levelId: 1, 
      text: '火', 
      furigana: 'ひ', 
      romaji: 'hi', 
      examples: [
        { 
          sentence: '火をつける',
          meanings: [
            { meaning: 'Light a fire', code: 'en' },
            { meaning: 'Encender un fuego', code: 'es' },
            { meaning: 'Allumer un feu', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'fire', code: 'en' },
        { meaning: 'fuego', code: 'es' },
        { meaning: 'feu', code: 'fr' },
      ]
    },
    {  
      levelId: 1, 
      text: '風', 
      furigana: 'かぜ', 
      romaji: 'kaze', 
      examples: [
        { 
          sentence: '風が吹く',
          meanings: [
            { meaning: 'The wind blows', code: 'en' },
            { meaning: 'El viento sopla', code: 'es' },
            { meaning: 'Le vent souffle', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'wind', code: 'en' },
        { meaning: 'viento', code: 'es' },
        { meaning: 'vent', code: 'fr' },
      ]
    },
    {  
      levelId: 1, 
      text: '土', 
      furigana: 'つち', 
      romaji: 'tsuchi', 
      examples: [
        { 
          sentence: '土を掘る',
          meanings: [
            { meaning: 'Dig the soil', code: 'en' },
            { meaning: 'Cavar la tierra', code: 'es' },
            { meaning: 'Creuser la terre', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'soil', code: 'en' },
        { meaning: 'tierra', code: 'es' },
        { meaning: 'terre', code: 'fr' },
      ]
    },
    {  
      levelId: 1, 
      text: '空', 
      furigana: 'そら', 
      romaji: 'sora', 
      examples: [
        { 
          sentence: '空を見上げる',
          meanings: [
            { meaning: 'Look up at the sky', code: 'en' },
            { meaning: 'Mirar al cielo', code: 'es' },
            { meaning: 'Regarder le ciel', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'sky', code: 'en' },
        { meaning: 'cielo', code: 'es' },
        { meaning: 'ciel', code: 'fr' },
      ]
    },
    {  
      levelId: 1, 
      text: '山', 
      furigana: 'やま', 
      romaji: 'yama', 
      examples: [
        { 
          sentence: '山に登る',
          meanings: [
            { meaning: 'Climb the mountain', code: 'en' },
            { meaning: 'Escalar la montaña', code: 'es' },
            { meaning: 'Gravir la montagne', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'mountain', code: 'en' },
        { meaning: 'montaña', code: 'es' },
        { meaning: 'montagne', code: 'fr' },
      ]
    },
    {  
      levelId: 1, 
      text: '川', 
      furigana: 'かわ', 
      romaji: 'kawa', 
      examples: [
        { 
          sentence: '川を渡る',
          meanings: [
            { meaning: 'Cross the river', code: 'en' },
            { meaning: 'Cruzar el río', code: 'es' },
            { meaning: 'Traverser la rivière', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'river', code: 'en' },
        { meaning: 'río', code: 'es' },
        { meaning: 'rivière', code: 'fr' },
      ]
    },
    {  
      levelId: 1, 
      text: '森', 
      furigana: 'もり', 
      romaji: 'mori', 
      examples: [
        { 
          sentence: '森を歩く',
          meanings: [
            { meaning: 'Walk in the forest', code: 'en' },
            { meaning: 'Caminar en el bosque', code: 'es' },
            { meaning: 'Marcher dans la forêt', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'forest', code: 'en' },
        { meaning: 'bosque', code: 'es' },
        { meaning: 'forêt', code: 'fr' },
      ]
    },
    {  
      levelId: 1, 
      text: '海', 
      furigana: 'うみ', 
      romaji: 'umi', 
      examples: [
        { 
          sentence: '海で泳ぐ',
          meanings: [
            { meaning: 'Swim in the sea', code: 'en' },
            { meaning: 'Nadar en el mar', code: 'es' },
            { meaning: 'Nager dans la mer', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'sea', code: 'en' },
        { meaning: 'mar', code: 'es' },
        { meaning: 'mer', code: 'fr' },
      ]
    },
    {  
      levelId: 1, 
      text: '花', 
      furigana: 'はな', 
      romaji: 'hana', 
      examples: [
        { 
          sentence: '花が咲く',
          meanings: [
            { meaning: 'Flowers bloom', code: 'en' },
            { meaning: 'Las flores florecen', code: 'es' },
            { meaning: 'Les fleurs fleurissent', code: 'fr' },
          ]
        }
      ], 
      meanings: [
        { meaning: 'flower', code: 'en' },
        { meaning: 'flor', code: 'es' },
        { meaning: 'fleur', code: 'fr' },
      ]
    },
  ]
  
  for (const word of words) {
    // 既存のレコードを確認
    const existingWord = await prisma.word.findFirst({
      where: { text: word.text },
    });

    // 既存のレコードがない場合のみ作成
    if (!existingWord) {
      await prisma.word.create({
        data: {
          level: {
            connect: { id: word.levelId },
          },
          text: word.text,
          furigana: word.furigana,
          romaji: word.romaji,
          meanings: {
            create: word.meanings.map(meaning => ({
              meaning: meaning.meaning,
              language: {
                connect: { code: meaning.code },
              },
            })),
          },
          examples: {
            create: word.examples.map(example => ({
              sentence: example.sentence,
              meanings: {
                create: example.meanings.map(meaning => ({
                  meaning: meaning.meaning,
                  language: {
                    connect: { code: meaning.code },
                  },
                })),
              }
            })),
          },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 