import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { fileRemover, fileUploader } from "../utils/utils.js";
import articlePostModel from "../models/articlePost.model.js";
import articleModel from "../models/article.modle.js";
import ApiResponse from "../utils/ApiResponse.js";

const createArticlePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const file = req.files.posturl;
    // console.log(id);
    // console.log(req.files);

    if (!id) {
        return next(createError(422, "ArticleId required"))
    }

    const isArticleExist = await articleModel.findOne({ _id: id })
    if (!isArticleExist) {
        return next(createError(404, "Invalid article."))
    }


    const validMimeType = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4"
    ];

    const fileSizeInBytes = file.size;

    if (!file.size) {
        return next(createError(400, "File size is undefined"));
    }

    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMB.toFixed(2) > 10) {
        return next(createError(400, "File size is too large"));
    }

    if (!validMimeType.includes(file.mimetype)) {
        return next(createError(422, "Invalid file type"))
    }

    const uploadedFile = await fileUploader(file)

    const articlePost = await articlePostModel.create({
        ArticleId: id,
        author: req.user._id,
        posturl: uploadedFile.secure_url,
        mimetype: file.mimetype.split("/")[0]
    })

    res.status(200).json(new ApiResponse(articlePost, "article post uploaded."))
})

const deleteArticlePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(createError(422, "Id required."))
    }

    const post = await articlePostModel.findOne({ _id: id, author: req.user._id })
    if (!post) {
        return next(createError(404, "Invalid Article post."))
    }

    const key = post.posturl.split("/news/")[1].split(".")[0]
    const isDeleted = await fileRemover(key)
    if (!isDeleted) {
        return next(500, "Something went wrong.")
    }

    await post.deleteOne();
    res.status(200).json(new ApiResponse(null, "Article post deleted."))
})

const fetchArticlePost = asyncHandler(async (req, res, next) => {
    const { page, limit, sort } = req.query;
    const { ArticleId } = req.params;
    const skip = (page - 1) * limit;

    const articlePost = await articlePostModel.find({ ArticleId }).skip(skip).limit(limit).sort(sort).populate({
        path: "author",
        model: "articleModel",
    }).select("-mimetype -createdAt -__v -updatedAt")

    res.status(200).json(new ApiResponse(articlePost, "Article post fetched."))

})


export { createArticlePost, deleteArticlePost, fetchArticlePost }