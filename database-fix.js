import Prisma from "@prisma/client"
const prisma = new Prisma.PrismaClient()
import { convertTimeUTCToJP, DateWithOffset } from "./util.js"

const actionStoringData = [
  "create",
  "createMany",
  "update",
  "updateMany",
  "upsert",
]

const originUnpack = prisma._fetcher.unpack
prisma._fetcher.unpack = (...args) => {
  const originDate = Date
  Date = DateWithOffset
  const result = originUnpack.apply(prisma._fetcher, args)
  Date = originDate

  return result
}

prisma.$use(async (params, next) => {
  if (actionStoringData.includes(params.action)) {
    convertTimeUTCToJP(params)
  }
  const result = await next(params)
  return result
})

export { prisma }
