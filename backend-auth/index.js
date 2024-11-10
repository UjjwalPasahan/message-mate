import express from 'express'
import dotenv from 'dotenv'
import { connectionInstance } from './db/connectToDB.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
const app = express()
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL in production
    credentials: true
}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



const port = process.env.port

connectionInstance()
.then(()=>console.log("connected"))
.catch((err)=>console.log(err))


import authRouter from './route/authRoute.js'
import userRouter from './route/usersRoutes.js'

app.use('/auth',authRouter)
app.use('/users',userRouter)


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))