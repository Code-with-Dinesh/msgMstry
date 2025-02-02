import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number,
}

const connection : ConnectionObject = {}

export async function connectDB(): Promise<void> {
    try {
        if (connection.isConnected) {
            console.log("Alredy Connected To the Database")
            return;
        }

        await mongoose.connect(process.env.MONGO_URL || '');
        console.log("MongoDB Connected Successfully");
    } catch (error: any) {
        console.error(`Error on DB connection: ${error.message}`);
    }
}

export default connectDB;