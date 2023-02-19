import { prisma } from "../../../database-fix.js"

export default async (req, res) => {
  const limit = +req.query.limit || 1000
  const posts = await getPost({ limit })
  res.send(posts)
}

function getPost(searchParams) {
  const { limit } = searchParams
  return prisma.post.findMany({
    include: {
      user: true,
    },
    take: limit,
  })
}
