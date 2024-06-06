import asyncHandler from "express-async-handler"
import userModel from "../models/user.model.js";
import createError from "http-errors";
import ApiResponse from "../utils/ApiResponse.js";
import articleModel from "../models/article.modle.js";


const createArticle = asyncHandler(async (req, res, next) => {
    const { title, content, source, publishedAt } = req.body;

    if (!title || !content || !source || !publishedAt) {
        return next(createError(422, "title, content, source, and publishedAt are required."));
    }

    const article = await articleModel.create({
        author: req.user._id,
        title,
        content,
        source,
        publishedAt
    });

    res.status(200).json(new ApiResponse(article, "article created successfully."));
})

const fetchArticle = asyncHandler(async (req, res, next) => {
    const { page, limit, sort } = req.query;
    const skip = (page - 1) * limit;

    const article = await articleModel.find({}).skip(skip).limit(limit).sort(sort)
        .select("-createdAt -__v -updatedAt -_id")

    res.status(200).json(new ApiResponse(article, "article fetched"))

})

const deleteArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(createError(422, "Id required."))
    }

    const article = await articleModel.findById(req.params.id)
    if (!article) {
        return next(createError(404, "Article not found."))
    }

    await article.deleteOne()
    res.status(200).json(new ApiResponse(null, "Article deleted."))
})

const updateArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { title, content } = req.body;

    if (!id) {
        return next(createError(422, "Id required."))
    }

    const article = await articleModel.findById(req.params.id)
    if (!article) {
        return next(createError(404, "Article not found."))
    }

    article.title = title || article.title
    article.content = content || article.content

    await article.save()

    res.status(200).json(new ApiResponse(article, "Article updated."))
})



export { createArticle, deleteArticle, fetchArticle, updateArticle }