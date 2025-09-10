import {z} from "zod";
export const signuppostrequest=z.object({
    firstname:z.string(),
    lastname:z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3)

})
export const loginpostrequest=z.object({
    email:z.string().email(),
    password:z.string().min(3)
})
export const urlshortenpostrequest=z.object({
    url:z.string().url(),
    code:z.string().optional()
})