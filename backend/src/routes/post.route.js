import { Router } from "express";
const router = Router();

import { createPost, getPosts } from "../controller/post.controller.js";
import { verifyToken } from "../middleware/verify.js";

router.post("/create", verifyToken, createPost);
router.get("/", getPosts);

export default router;
