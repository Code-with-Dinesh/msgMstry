import {z} from 'zod'

export const msgValidation = z.object({
    content:z.string().min(10,{message:'content must be in 10 character'})
    .max(300,'content not greater then Character')
})