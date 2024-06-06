import express from "express";
import dbConnect from "./db/dbConnect.js";
import config from "./config/config.js";
import userRouter from "./routes/user.routes.js";
import errorHandler from "./middleware/errorhandler.js";
import cookieParser from "cookie-parser";
import articleRouter from "./routes/article.routes.js";
import { articlePostRouter } from "./routes/articlePost.routes.js";
import fileUpload from "express-fileupload";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload())

//@All Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/article", articleRouter)
app.use("/api/v1/articlepost", articlePostRouter)


//@Global middleware
app.use(errorHandler)

dbConnect().then(() => {

    const PORT = config.PORT
    app.listen(PORT, () => {
        console.log(`database connected successfully`, PORT);
    })
}).catch((error) => {
    console.log("db error!!.", error);
})