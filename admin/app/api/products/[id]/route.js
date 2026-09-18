import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connect from "@/lib/db";
import { withAdmin, badRequest, notFound, serverError } from "@/lib/apiGuard";

export const GET = withAdmin(async (request, { params }) => {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return badRequest("Invalid product id");

  try {
    await connect();
    const product = await Product.findById(id);
    if (!product) return notFound("No product with that id");
    return NextResponse.json(product);
  } catch (error) {
    return serverError(error, "GET /api/products/[id]");
  }
});

export const DELETE = withAdmin(async (request, { params }) => {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return badRequest("Invalid product id");

  try {
    await connect();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return notFound("No product with that id");
    return NextResponse.json({ message: "Product has been deleted" });
  } catch (error) {
    return serverError(error, "DELETE /api/products/[id]");
  }
});
