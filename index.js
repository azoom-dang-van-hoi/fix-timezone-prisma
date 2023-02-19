import express from "express"
import cors from "cors"
import statuses from "statuses"
import router from "./routes/index.js"

// Customize express response
express.response.sendStatus = function (statusCode) {
  const body = { message: statuses[statusCode] || String(statusCode) }
  this.statusCode = statusCode
  this.type("json")
  this.send(body)
}
const app = express()
const port = process.env.PORT || 5009
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(router)

app.listen(port, () => console.log("Server start on port", port))
