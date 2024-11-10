import dotenv from 'dotenv'
import mongoose from 'mongoose'


export const connectionInstance = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("connection eshtalished")
    } catch (error) {
        console.log(error)
    }
}