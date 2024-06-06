import express from "express";
import auth from "../middleware/auth.js";
import { admin, validateFetchReq } from "../middleware/validator.js";
import { createArticlePost, deleteArticlePost, fetchArticlePost } from "../controllers/articlePost.controller.js";

const articlePostRouter = express.Router();

articlePostRouter.route("/:id").post(auth, admin, createArticlePost)
articlePostRouter.route("/:id").delete(auth, admin, deleteArticlePost)
articlePostRouter.route("/:ArticleId").get(validateFetchReq, auth, fetchArticlePost)


export { articlePostRouter };

