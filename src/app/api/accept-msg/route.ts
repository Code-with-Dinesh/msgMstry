import connectDB from "@/app/lib/Dbconnect";
import UserModel from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
export  async function POST(request:NextRequest){
    await connectDB()
    try {
      const session = await getServerSession(authOptions)
      const user =  session?.user 
      if(!session || !session.user){
        return NextResponse.json({success:false,message:"User can not Authenticated"},{status:401})
      }
      const userId = user?._id;
      const {acceptingmsg} = await request.json()
      const UpdateUser =  await UserModel.findByIdAndUpdate({userId,isAccepingMesg:acceptingmsg},{new:true})
      if(!UpdateUser){
        return NextResponse.json({success:false,message:"Failed to Update the user Status"},{status:501})
      }
      else{
        return NextResponse.json({success:true,message:"Message accepted Successfully",UpdateUser},{status:200})
      }
    } catch (error) {
        console.log('Error while Message Aceepting',error)
        return NextResponse.json({success:false,message:'Error while Message acceting'},{status:500})
    }
}

export async function GET(request:NextResponse) {
    await connectDB();
    try {
       const session =  await getServerSession(authOptions)
       const user = session?.user;
       if(!session || !session.user){
        return NextResponse.json({success:false,message:'Not Authorize user'},{status:400})
       }
       const userId = user?._id;
       
       const foundUser = await UserModel.findOne({userId})
       if(!foundUser){
        return NextResponse.json({success:false,message:'User Not Found'},{status:404})
       }
       return NextResponse.json({success:true,isAccepingMesg:foundUser.isAccepingMesg},{status:200})
    } catch (error) {
        console.log('Error while Message fetching')
        return NextResponse.json({success:false,message:"Error while message fetching"},{status:400})
    }
}