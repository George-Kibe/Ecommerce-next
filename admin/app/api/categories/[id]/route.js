import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Category from "@/models/Category";

export const DELETE = async (request, {params}) => {
    const {id} = params;
    try {
        await connect();
        await Category.findByIdAndDelete(id);
        return new NextResponse("Category has been deleted!", {status:200})
    } catch (error) {
        return new NextResponse("Internal Server Error", { status:500})
    }
}