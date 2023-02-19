import { prisma } from "../../../database-fix.js"

export default async (req, res) => {
  const { name, id } = req.body

  const user = await prisma.user.upsert({
    where: {
      id,
    },
    update: {
      name,
      updatedAt: new Date(),
    },
    create: {
      name,
    },
  })
  return res.send(user)
}
