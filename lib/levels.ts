import { prisma } from "@/prisma"

export const getLevels = async () => {
  const levels = await prisma.level.findMany({
    include: {
      words: {
        select: {
          id: true,
          wordStatus: true,
        },
      },
    },
  })
  console.log(levels)
  return levels
}


