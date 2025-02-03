import connectDB from "@/app/lib/Dbconnect";
import {z} from 'zod'
import UserModel from "@/app/models/User";
import {UsernameValidation} from '@/app/Schema/signupSchema'
import { NextRequest, NextResponse } from "next/server";

const UsernameSignUpSchema = z.object({
    username:UsernameValidation
})

export async function GET(request:NextRequest){
    
    connectDB()
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username:searchParams.get('username')
        }
        // validation with zod
       const result =  UsernameSignUpSchema.safeParse(queryParams)
       console.log(result)
       if(!result.success){
        const usernameError = result.error.format().username?._errors || []
        return NextResponse.json({success:false,message:'Formating userError'},{status:500})
       }
       const {username} = result.data
       const ExistingVerifyuser = await UserModel.findOne({username,verifed:true})
       if(ExistingVerifyuser){
        return NextResponse.json({success:false,message:"Username already taken",},{status:400})
       }
       return NextResponse.json({success:true,message:"Username is Unique",},{status:200})

    } catch (error) {
        console.log("error checking username",error)
        return NextResponse.json({success:false,message:'Error checking username'},{status:500})
    }
}