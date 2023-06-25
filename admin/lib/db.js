import mongoose from "mongoose";


const connect = async() => {
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connection to MongoDB Successful")
    } catch (error) {
        throw new Error("Connection Failed!")
    }
}

export default connect;