import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import connectDB from "@/app/lib/Dbconnect";
import UserModel from "@/app/models/User";

export const authOptions:NextAuthOptions ={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any) :Promise<any>{
                await connectDB()
                try {
                  const user =  await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No User Found With this username')
                    }
                    if(!user.verifed){
                        throw new Error('Please Verify Your Account First')
                    }
                   const isPasswordcorrect =  await bcrypt.compare(credentials.password,user.password)
                   if(isPasswordcorrect){
                    return user
                   }else{
                    throw new Error('Incorrect Password')
                   }
                } catch (error:any) {
                    throw new Error(error)
                }
              }
        })
    ],
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.verifed = token.verifed,
                session.user.isAccepingMesg = token.isAccepingMesg,
                session.user.username =  token.username
            }
            return session
          },
          async jwt({ token,user }) {
            if(user){
                token._id = user._id?.toString()
                token.verifed = user.verifed
                token.isAccepingMesg = user.isAccepingMesg
                token.username = user.username
            }
            return token
          }
    },
      pages: {
        signIn: "/signin"
      },
      
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}