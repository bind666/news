import { Schema, model } from "mongoose";

const articlePostSchema = new Schema({
    //_id
    ArticleId: {
        type: String,
        required: true
    },
    //author: creatorId or userid
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    posturl: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        enum: ["image", "video"],
        default: "image"
    }
}, {
    timestamps: true
})

const articlePostModel = model("articlePostModel", articlePostSchema)
export default articlePostModel;