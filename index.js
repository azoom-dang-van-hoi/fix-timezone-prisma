import { prisma, convertUTCToJP } from "./database.js"

main()
async function main() {
  const isAddNewRecord = process.argv[2] == "add-new"

  const data = isAddNewRecord ? await addNewRecord() : await getUsers()

  console.log(data)
}

function getUsers() {
  return prisma.user.findMany({
    include: {
      post: true,
    },
  })
}

function addNewRecord() {
  return prisma.$transaction(async (trx) => {
    const user = await trx.user.create({
      data: {
        name: "Test User",
      },
    })
    const post = await trx.post.create({
      data: {
        content: "Post content",
        targetDate: new Date(),
        userId: user.id,
        createdAt: convertUTCToJP(new Date()),
      },
    })
    return {
      user,
      post,
    }
  })
}
