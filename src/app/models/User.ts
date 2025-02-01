import mongoose ,{Document} from "mongoose";

export interface Message extends Document{
        content:string,
        createdAt:Date,
}

const MessageSchema = new mongoose.Schema<Message>({
        content:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
})

// now created the user Schema

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifed:boolean,
    isAccepingMesg:boolean,
    VerifyCode:string,
    VerifyCodeExpiry:Date,
    message:Message[]
}

const UserSchema =  new mongoose.Schema<User>({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    verifed:{
        type:Boolean,
        default:false,
        required:true,
    },
    isAccepingMesg:{
        type:Boolean,
        required:true,
    },
    VerifyCode:{
        type:String,
        required:true,
    },
    VerifyCodeExpiry:{
        type:Date,
        required:true
    },
    message:[MessageSchema]
})

const UserModel =(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
export { MessageSchema };