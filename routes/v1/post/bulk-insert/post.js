import { prisma } from "../../../../database.js"

export default async (req, res) => {
  const userId = +req.body.userId || 1
  console.time("Insert bulk:")
  const posts = await createPosts(userId)
  console.timeEnd("Insert bulk:")
  return res.send(posts)
}

function createPosts(userId) {
  const listPost = []
  for (let index = 0; index < 1000; index++) {
    listPost.push({
      targetDate: new Date("2021-01-01"),
      content: `Test ${index + 1}`,
      userId,
      createdAt: new Date(),
    })
  }
  return prisma.post.createMany({
    data: listPost,
  })
}
