import connectDB from "@/app/lib/Dbconnect";
import UserModel from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request:NextRequest){
    await connectDB();
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user
        if(!session || !session.user){
            return NextResponse.json({success:false,message:"User is not Authorize"},{status:500})
        }
        const userId = new mongoose.Types.ObjectId(user?._id)
        const myuser = await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'message'},
            {$sort:{'message.createdAt':-1}},
            {$group:{_id:'$_id',message:{$push:'$message'}}}
        ])

        if(!myuser || myuser.length === 0 ){
            return NextResponse.json({success:false,message:"User not found"},{status:400})
        }

        return NextResponse.json({success:false,message:myuser[0].message},{status:200})
        
    } catch (error) {
        return NextResponse.json({success:false,message:'Error While Fetching The Messages'},{status:500})
    }
}