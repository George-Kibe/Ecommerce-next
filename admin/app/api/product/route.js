import Product from "@/models/Product";
import { NextResponse } from "next/server";
import connect from "@/lib/db";

async function handler(req,res){
    const {method} = req;
    await connect();
    
    if (method === "POST"){
        const body = await req.json()
        const {title, description, price} = body;
        const newProduct = new Product({
            title, description, price:parseInt(price)
        })
        try {
            await newProduct.save();
            console.log("saved!")
            return new NextResponse("Product has been created", {status: 201})
        } catch (error) {
            console.log("Product saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }
    if (method === "GET"){
      const products = await  Product.find()
      const allProducts = JSON.stringify(products)
      console.log(allProducts)
      return new NextResponse(allProducts, {status: 200})
    }
    
}

export { handler as GET, handler as POST };