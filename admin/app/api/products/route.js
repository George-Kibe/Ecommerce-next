// import clientPromise from "@/lib/mongodb";
import Product from "@/models/Product";
// import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connect from "@/lib/db";

// export const POST = async (request) => {
//     const body = await request.json()
//     console.log(body)
//     const {name, email, password} = await request.json();
//     return new NextResponse(req.method, { status:200})
// }

async function handler(req,res){
    const {method} = req;
    const body = await req.json()
    const {title, description, price} = body;
    // mongoose.Promise = clientPromise;
    await connect();
    const newProduct = new Product({
        title, description, price:parseInt(price)
    })
    console.log(newProduct)
    if (method === "POST"){
        try {
            await newProduct.save();
            console.log("saved!")
            return new NextResponse("Product has been created", {status: 201})
        } catch (error) {
            console.log("Product saving error!")
            return new NextResponse(error.message, {status: 422})

        }      
    }
    
}

export { handler as GET, handler as POST };