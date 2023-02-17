import Prisma from "@prisma/client"
const prisma = new Prisma.PrismaClient()

const originDate = Date
const HOURS_OFFSET = -9

class DateWithOffset extends Date {
  constructor(options) {
    if (options) {
      if (typeof options === "string") {
        const t = new originDate(options)
        const d = new originDate(t.setHours(t.getHours() + HOURS_OFFSET))

        super(d)
      } else {
        super(options)
      }
    } else {
      super(originDate.now())
    }
  }
}

const originUnpack = prisma._fetcher.unpack
prisma._fetcher.unpack = (...args) => {
  Date = DateWithOffset
  const res = originUnpack.apply(prisma._fetcher, args)

  Date = originDate

  return res
}

export { prisma }
