import express from "express"
import { usersTable } from "../models/index.js"
import db from '../db/index.js'
import { eq } from "drizzle-orm"
import { getUserByEmail } from "../services/user.services.js"
import { hashPassword } from "../utils/user.utils.js"
import {signuppostrequest,loginpostrequest} from '../validations/request.validation.js'
import jwt from 'jsonwebtoken'

const router =express.Router()
router.post('/signup',async (req,res)=>{
    const validationResult=await signuppostrequest.safeParseAsync(req.body)
    if(validationResult.error){
        return res.status(400).json({error:validationResult.error.message})
    }
    const {firstname,lastname,email,password}=validationResult.data
   const existingUser=await getUserByEmail(email)
    if(existingUser){
        return res.status(400).json({error:"User already exists"})
    }
   
    const {salt,hashedPassword}=hashPassword(password)
    const [user]=await db.insert(usersTable).values({
        firstname,
        lastname,
        email,
        salt,
       password:hashedPassword
    }).returning({id:usersTable.id})
    return res.status(201).json({message:"user created successfully",userId:user.id})
})
router.post('/login',async (req,res)=>{
    const validationresult=await loginpostrequest.safeParseAsync(req.body)
    if(validationresult.error){
        return res.status(400).json({error:validationresult.error.message})
    }
    const {email,password}=validationresult.data
    const existingUser=await getUserByEmail(email)
    if(!existingUser){
        return res.status(400).json({error:"User does not exist"})
    }
    const {hashedPassword}=hashPassword(password,existingUser.salt)
    if(existingUser.password!==hashedPassword){
        return res.status(400).json({error:"Invalid password"})
    }
    const payload={
       id:existingUser.id
    }
    const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1m'})
    return res.status(200).json({message:"login successful",token})
})
export default router