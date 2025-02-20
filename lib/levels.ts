import { auth } from "@/auth"
import { prisma } from "@/prisma"

export const getLevels = async () => {
  const session = await auth()
  const levels = await prisma.level.findMany({
    include: {
      words: {
        select: {
          id: true,
          wordStatus: {
            where: {
              userId: session?.user?.id,
            },
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    },
  })
  return levels
}


