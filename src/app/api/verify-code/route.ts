import connectDB from "@/app/lib/Dbconnect";
import UserModel from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    connectDB()
    try {
        const {username,code} = await request.json()
       const decodedusername =  decodeURIComponent(username)
       const user = await UserModel.findOne({username:decodedusername})
       if(!user){
        return NextResponse.json({success:false,message:"Username not found"},{status:500})
       }
       
       const isverifycode = user.VerifyCode === code;
       const isCodeExpirey = new Date(user.VerifyCodeExpiry) > new Date()
       if(isverifycode && isCodeExpirey){
         user.verifed = true
         await user.save()
         return NextResponse.json({success:true,message:"User Code verifed Successfully"},{status:200})
       }else if(!isCodeExpirey){
        return NextResponse.json({success:false,message:"User Code Expire Singup again to get code"},{status:400})
       }else{
        return NextResponse.json({success:false,message:"Invalid Code"},{status:500})

       }

    } catch (error) {
        console.log('error while opt validation',error)
        return NextResponse.json({success:false,message:"Error in OTP Verification"},{status:400})
    }
}