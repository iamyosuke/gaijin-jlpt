import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // レベルデータを作成
  const level1 = await prisma.level.create({
    data: {
      name: '初級',
      order: 1,
      words: {
        create: [
          {
            kanji: '猫',
            furigana: 'ねこ',
            meaningEn: 'cat',
            examples: {
              create: [
                {
                  sentence: '猫が好きです。',
                  meaningEn: 'I like cats.',
                },
              ],
            },
          },
          {
            kanji: '犬',
            furigana: 'いぬ',
            meaningEn: 'dog',
            examples: {
              create: [
                {
                  sentence: '犬は友達です。',
                  meaningEn: 'Dogs are friends.',
                },
              ],
            },
          },
        ],
      },
    },
  })

  const level2 = await prisma.level.create({
    data: {
      name: '中級',
      order: 2,
      words: {
        create: [
          {
            kanji: '車',
            furigana: 'くるま',
            meaningEn: 'car',
            examples: {
              create: [
                {
                  sentence: '車を運転します。',
                  meaningEn: 'I drive a car.',
                },
              ],
            },
          },
          {
            kanji: '電車',
            furigana: 'でんしゃ',
            meaningEn: 'train',
            examples: {
              create: [
                {
                  sentence: '電車で通勤します。',
                  meaningEn: 'I commute by train.',
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('Seed data created:', { level1, level2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 