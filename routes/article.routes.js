import express from "express";
import auth from "../middleware/auth.js";
// import { admin } from "../middleware/validator.js";
import { createArticle, deleteArticle, fetchArticle, updateArticle } from "../controllers/article.controller.js";
import { admin, validateFetchReq } from "../middleware/validator.js";

const articleRouter = express.Router();

articleRouter.route("/create").post(auth, admin, createArticle)
articleRouter.route("/").get(validateFetchReq, auth, fetchArticle)
articleRouter.route("/:id").delete(auth, admin, deleteArticle)
articleRouter.route("/:id").put(auth, admin, updateArticle)

export default articleRouter