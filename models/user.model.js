import createError from "http-errors";
import { Schema, model } from "mongoose";
import bcrypt, { hash } from "bcrypt";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String,
        default: null
    },
    accessToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})


userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) next()
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {
        return next(createError(500, error.message))
    }
})


const userModel = model("userModel", userSchema)
export default userModel;