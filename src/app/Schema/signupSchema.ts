import { z } from "zod";

export const UsernameValidation = z.
    string()
    .min(2,"Username Minimum 2 characters")
    .max(20,"Username Maximum 20 Characters")


export const signupSchema  = z.object({
    username:UsernameValidation,
    email:z.string().email({message:'Invalid Email Address'}),
    password:z.string().min(6,"Password must be 6 Digit Long")
})