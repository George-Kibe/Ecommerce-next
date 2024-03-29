import Product from "@/models/Product";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import {isAdminRequest } from "../auth/[...nextauth]/route";

async function handler(req,res){
    const {method} = req;
    await connect();
    // To confirm user is logged in and is an admin, prevent third parties and postman access
    // try {
    //     await isAdminRequest()
    // } catch (error) {
    //     return new NextResponse("No necessary privileges!", {status: 401})
    // }

    if (method === "GET"){
        const url = new URL(req.url);
        const id = url.searchParams.get("id")
        if(id){
          try {
              const product = await Product.findOne({_id:id})
              const productData = JSON.stringify(product)
              return new NextResponse(productData, {status: 200})
          } catch (error) {
              return new NextResponse('No Product with That ID', {status: 404})
          }
        }
        const products = await  Product.find()
        const allProducts = JSON.stringify(products)
        // console.log(allProducts)
        return new NextResponse(allProducts, {status: 200})
      }   
    
    if (method === "POST"){
        const body = await req.json()
        const {title, description, category, images, price, properties} = body;
        const newProduct = new Product({
            title, description, properties, category, images, price:parseInt(price)
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
    if (method === "PUT"){
        const body = await req.json()
        const {title, description, properties, category, images, price, _id} = body;
        try {
            await Product.updateOne({_id}, {title, description, properties,category, images, price:parseInt(price)})
            console.log("Updated!")
            return new NextResponse("Product has been Updated", {status: 200})
        } catch (error) {
            console.log("Product saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }     
}

export { handler as GET, handler as POST, handler as PUT };