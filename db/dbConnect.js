import mongoose from "mongoose";
import config from "../config/config.js"

async function dbConnect() {
    try {
        mongoose.connection.on("connected", () => {
            console.log(`databse connected successfully.`, mongoose.connection.host);
        })
        mongoose.connection.on("disconnect", () => {
            console.log(`databse disconnected.`, mongoose.connection.host);
        })
        mongoose.connection.on("error", () => {
            console.log(`db error!!.`, mongoose.connection.host);
        })

        await mongoose.connect(config.DB_URI)
    } catch (error) {
        console.log(`db connection error!.`, error);
    }
}

export default dbConnect;

