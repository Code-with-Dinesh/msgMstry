import UserModel, { Message } from "@/app/models/User";
import connectDB from "@/app/lib/Dbconnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    await connectDB()
    try {
        const ReqBody = await request.json()
        const {username,content} = ReqBody;
        const user = await UserModel.findOne({username})
        if(!user){
            return NextResponse.json({success:false,message:'User not found'},{status:400})
        }
        if(!user.isAccepingMesg){
            return NextResponse.json({success:false,message:'User Not Accepting The Message'},{status:403})
        }
       const newMessage = {content,createdAt:new Date()}
       user.message.push(newMessage as Message)
       await user.save()
       return NextResponse.json({success:true,message:'Message sent Successfully'},{status:200})

    } catch (error) {
        console.log('Error while Sending the message',error)
        return NextResponse.json({success:false,message:'Error while Message Sending'},{status:500})
    }
}