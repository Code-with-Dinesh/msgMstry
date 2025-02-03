import connectDB from "@/app/lib/Dbconnect";
import UserModel from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt  from 'bcryptjs'
import { SendVerificationEmail } from "@/app/helper/sendVerificationEmail";
export async function POST(request:NextRequest) {
    try {
        await connectDB()
        const Reqbody = await request.json()
        const {username,email,password} = Reqbody
        const existendUserByUsername = await UserModel.findOne({username,verifed:true})
        if(existendUserByUsername){
            return NextResponse.json({success:false,message:'Username is Already Taken'},{status:500})
        }
        const existenceUserByEmail = await UserModel.findOne({email})
        const VerifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existenceUserByEmail){
            if(existenceUserByEmail.verifed){
                return NextResponse.json({success:false,message:'User Already Exist with this Email'},{status:500})
            }
            else{
                const hashpassword = await bcrypt.hash(password,10)
                existenceUserByEmail.password = hashpassword,
                existenceUserByEmail.VerifyCode = VerifyCode,
                existenceUserByEmail.VerifyCodeExpiry = new Date(Date.now() * 3600000)
                await existenceUserByEmail.save()
            }
        }
        else{
            const hashpassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser  =  new UserModel({
                username,
                email,
                password:hashpassword,
                verifed:false,
                isAccepingMesg:true,
                VerifyCode,
                VerifyCodeExpiry:expiryDate,
                message:[]
           })
            await newUser.save()
        }
        // send Verification Code
       const EmailResponse =  await  SendVerificationEmail(email,username,VerifyCode);
       if(!EmailResponse.success){
            return NextResponse.json({success:false,message:EmailResponse.message},{status:500})
       }
       return NextResponse.json({success:true,message:'User registreation successfully Please Verify Your Email'},{status:201})

    } catch (error) {
        console.log('Error while Signup',error)
        return NextResponse.json({
            success:false,
            message:'Error Registred User',
            
        },{status:500},)
    }
}