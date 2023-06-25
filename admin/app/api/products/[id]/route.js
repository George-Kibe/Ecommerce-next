import Product from "@/models/Product";
import connect from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
    const {id} = params;
    console.log(id)
    try {
        await connect();
        const product = await Product.findById(id);
        return new NextResponse(JSON.stringify(product), {status:200})
    } catch (error) {
        return new NextResponse("Database Error", { status:500})
    }
}

export const DELETE = async (request, {params}) => {
    const {id} = params;
    try {
        await connect();
        await Product.findByIdAndDelete(id);
        return new NextResponse("Product has been deleted!", {status:200})
    } catch (error) {
        return new NextResponse("Internal Server Error", { status:500})
    }
}