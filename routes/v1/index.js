import PromiseRouter from "express-promise-router"
import createPosts from "./post/bulk-insert/post.js"
const router = PromiseRouter()

router.post("/post/bulk-insert", createPosts)

export default router
