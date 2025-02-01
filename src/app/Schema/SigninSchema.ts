import {z} from 'zod'
export const SigninValidation  = z.object({
    Identifier:z.string(),
    password:z.string()
})
