import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler"
import userModel from "../models/user.model.js";
import createError from "http-errors";
import ApiResponse from "../utils/ApiResponse.js";
import { generateCookies } from "../utils/utils.js";

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    const isUser = await userModel.findOne({ email: email })
    if (isUser) {
        return next(createError(408, "user already exist"))
    }

    const user = await userModel.create(req.body)
    res.status(200).json(new ApiResponse(user, "user register succesfully"))
})

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email })
    if (!user) {
        return next(createError(402, "Invalid credintials"))
    }
    const isPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isPassword) {
        return next(createError(401, "Invalid credintials"))
    }

    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }

    const { refreshToken, accessToken } = generateCookies(payload)
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();

    res.status(200)
        .cookie("refreshToken", refreshToken, { httpOnly: true, expireIn: "24h" })
        .cookie("accessTokrn", accessToken, { httpOnly: true, expireIn: "8h" })
        .json(new ApiResponse({ user, refreshToken, accessToken }, "user login successfully"))

})

const refreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken: tokenFromClient } = req.cookies;

    if (!tokenFromClient) {
        return next(createError(422, "Tokens required."))
    }

    const isValid = await verifyToken(tokenFromClient)
    if (!isValid) {
        return next(createError(422, "invalid tokens"))
    }

    const isExpire = checkTokenExpiry(isValid.exp)
    if (isExpire) {
        return next(createError(401, "Token expired"))
    }

    const user = await userModel.findOne({ email: isValid.email, tokenFromClient }.select("+password"))

    if (!user) {
        return next(createError(422, "invalid user"))
    }

    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }

    const { refreshToken, accessToken } = generateCookies(payload);

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();

    res.status(200).json(new ApiResponse(payload, "Token refreshed!!"))
})

const logoutUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    await userModel.findByIdAndUpdate(_id, {
        refreshToken: null,
        accessToken: null,
    })

    res.status(200)
        .cookie("refreshToken", null, { httpOnly: true, expireIn: new Date() })
        .cookie("accessToken", null, { httpOnly: true, expireIn: new Date() })
        .json(new ApiResponse(null, "logout successfully"))
})
export { registerUser, loginUser, logoutUser ,refreshToken};