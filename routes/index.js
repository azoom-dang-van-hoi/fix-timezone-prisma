import PromiseRouter from "express-promise-router"
import v1 from "./v1/index.js"
import v2 from "./v2/index.js"
const router = PromiseRouter()

router.use("/v1", v1)
router.use("/v2", v2)

router.use((err, req, res, next) => {
  console.log(err)
  res.sendStatus(500)
})

export default router
