import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { checkTokenExpiry, verifyToken } from "../utils/utils.js";
import userModel from "../models/user.model.js";


const auth = asyncHandler(async (req, res, next) => {
    const { accessTokrn: accessToken } = req.cookies;
    // console.log(accessToken);

    if (!accessToken) {
        return next(createError(422, "Tokens required"))
    }

    const isValid = await verifyToken(accessToken)
    if (!isValid) {
        return next(createError(422, "Invalid tokens"))
    }

    const isExpire = checkTokenExpiry(isValid.exp)
    if (isExpire) {
        return next(createError(401, "Token expired"))
    }

    const user = await userModel.findOne({ email: isValid.email, accessToken })
    if (!user) {
        return next(createError(422, "invalid user"))
    }

    req.user = user;
    next();
})


export default auth;