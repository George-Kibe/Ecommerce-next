import Category from "@/models/Category";
import { NextResponse } from "next/server";
import connect from "@/lib/db";

async function handler(req,res){
    const {method} = req;
    await connect();

    if (method === "GET"){
        const url = new URL(req.url);
        const id = url.searchParams.get("id")
        const category = await  Category.find().populate("parentCategory")
        const categories = JSON.stringify(category)
        // console.log(allProducts)
        return new NextResponse(categories, {status: 200})
      }   
    
    if (method === "POST"){
        const body = await req.json()
        const {name, parentCategory} = body;
        try {
            if (parentCategory){
                const newCategory = new Category({name, parentCategory})
                await newCategory.save();
                console.log("category saved!")
                return new NextResponse("Category has been created", {status: 201})
            }
            const newCategory = new Category({name})
            await newCategory.save();
            console.log("category saved!")
            return new NextResponse("Category has been created", {status: 201})
        } catch (error) {
            console.log("Category saving error: ", error.message)
            return new NextResponse(error.message, {status: 422})
        }      
    }
    if (method === "PUT"){
        const body = await req.json()
        const {name, parentCategory, _id} = body;
        try {
            await Category.updateOne({_id}, {name, parentCategory})
            console.log("Updated!")
            return new NextResponse("Category has been Updated", {status: 200})
        } catch (error) {
            console.log("Category saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }     
}

export { handler as GET, handler as POST, handler as PUT };