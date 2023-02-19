import { prisma } from "../../../database-fix.js"

export default async (req, res) => {
  const newPost = await createPosts(req.body)
  res.send(newPost)
}

function createPosts(data) {
  return prisma.post.create({
    data: {
      targetDate: new Date("2021-01-01"),
      content: data.content,
      userId: +data.userId || 1,
      createdAt: new Date(),
    },
    include: {
      user: true,
    },
  })
}
