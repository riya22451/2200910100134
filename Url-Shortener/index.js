import express from "express"
import router from './routes/user.routes.js'
import { authenticateUser } from "./middlewares/auth.middleware.js"
import urlrouter from './routes/url.routes.js'
const app=express()

app.use(express.json())

const PORT=process.env.PORT || 3000
app.use('/api/users',router)
app.use('/',urlrouter)
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})