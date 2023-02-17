import Prisma from "@prisma/client"
const prisma = new Prisma.PrismaClient()
import { addHours } from "date-fns"

function prismaTimeMod(value) {
  if (value instanceof Date) {
    // Check Date field
    if (isDate(value)) {
      return value
    }
    return addHours(value, -9)
  }

  if (isPrimitive(value)) {
    return value
  }

  convertTimeJPToUTC(value)

  return value
}

function convertTimeJPToUTC(obj) {
  if (!obj) return

  for (const key of Object.keys(obj)) {
    const val = obj[key]

    if (val instanceof Date) {
      // Check Date field
      if (isDate(val)) {
        obj[key] = val
      } else {
        obj[key] = addHours(val, -9)
      }
    } else if (!isPrimitive(val)) {
      convertTimeJPToUTC(val)
    }
  }
}

function isPrimitive(value) {
  return value !== Object(value)
}

function isDate(dateTime) {
  return dateTime.toISOString().includes("T00:00:00.000Z")
}

prisma.$use(async (params, next) => {
  const result = await next(params)

  return prismaTimeMod(result)
})

function convertUTCToJP(value) {
  return addHours(value, 9)
}

export { prisma, convertUTCToJP }
