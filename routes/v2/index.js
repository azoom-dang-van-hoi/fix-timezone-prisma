import PromiseRouter from "express-promise-router"
import createPost from "./post/post.js"
import createPosts from "./post/bulk-insert/post.js"
import getPosts from "./post/get.js"
import upsertUser from "./user/post.js"
const router = PromiseRouter()

router.post("/post", createPost)
router.post("/post/bulk-insert", createPosts)
router.get("/post", getPosts)
router.post("/user", upsertUser)

export default router
