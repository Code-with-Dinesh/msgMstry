import {z} from 'zod'

export const msgAcceptValidation = z.object({
    acceptmessage:z.boolean()
})