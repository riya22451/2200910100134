import express from "express";
import { urlshortenpostrequest } from "../validations/request.validation.js";
import db from "../db/index.js";
import { nanoid } from "nanoid";
import { urlsTable } from "../models/url.model.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { eq } from "drizzle-orm";
const router=express.Router();
router.post('/shorten',async (req,res)=>{
    
    const validationResult=await urlshortenpostrequest.safeParseAsync(req.body);
    if(validationResult.error){
        return res.status(400).json({error:validationResult.error.message})
    }
    const {url,code}=req.body;
    const shortcode=code ? code :nanoid(6)
    const [result]=await db.insert(urlsTable).values({
        shortcode,
        targetUrl:url,
        
    }).returning({id:urlsTable.id,shortcode:urlsTable.shortcode,targetUrl:urlsTable.targetUrl})
    return res.status(201).json({message:"Url shorten successfully",shortcode:result.shortcode,targetUrl:result.targetUrl})


})

router.get('/:shortcode',async (req,res)=>{
    const {shortcode}=req.params;
    if(!shortcode){
        return res.status(400).json({error:"Shortcode is required"})
    }
    const [result]=await db.select({targetUrl:urlsTable.targetUrl}).from(urlsTable).where(eq(urlsTable.shortcode,shortcode))
    if(!result){
        return res.status(404).json({error:"url not found"})
    }
    return res.redirect(result.targetUrl)
})
export default router