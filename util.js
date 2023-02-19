const originDate = Date
const HOURS_OFFSET = -9

export class DateWithOffset extends Date {
  constructor(options) {
    if (options) {
      if (typeof options === "string") {
        const t = new originDate(options)
        if (isDate(t)) {
          super(t)
        } else {
          const d = new originDate(t.setHours(t.getHours() + HOURS_OFFSET))
          super(d)
        }
      } else {
        super(options)
      }
    } else {
      super(originDate.now())
    }
  }
}

export function convertTimeUTCToJP(obj) {
  if (!obj) return

  for (const key of Object.keys(obj)) {
    const val = obj[key]

    if (val instanceof Date) {
      // Check Date field
      if (isDate(val)) {
        obj[key] = val
      } else {
        const time = new originDate(val.setHours(val.getHours() - HOURS_OFFSET))
        obj[key] = time
      }
    } else if (!isPrimitive(val)) {
      convertTimeUTCToJP(val)
    }
  }
}

function isPrimitive(value) {
  return value !== Object(value)
}

function isDate(dateTime) {
  if (isNaN(dateTime)) return false
  return dateTime.toISOString().includes("T00:00:00.000Z")
}
