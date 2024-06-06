import { Schema, model } from "mongoose";

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    //author: creatorId
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    source: {
        type: String,
        ref: "userModel",
    },
    publishedAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true
});

const articleModel = model("articleModel", articleSchema);
export default articleModel;