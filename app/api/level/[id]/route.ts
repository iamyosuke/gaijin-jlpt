// import { prisma } from "@/prisma"
// import { NextRequest, NextResponse } from "next/server"

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = params
//   const userId = req.auth?.user?.id // ユーザーIDを取得する方法に応じて修正

//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const level = await prisma.level.findUnique({
//     where: { id: parseInt(id, 10) },
//     include: {
//       words: {
//         include: {
//           examples: true,
//           wordStatus: true,
//           userWordStatus: {
//             where: {
//               userId: userId, // 自分のuserIdに基づいてフィルタリング
//             },
//           },
//         },
//       },
//     },
//   })

//   if (!level) {
//     return NextResponse.json({ error: "Level not found" }, { status: 404 })
//   }

//   return NextResponse.json(level)
// } 