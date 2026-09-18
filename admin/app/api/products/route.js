import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connect from "@/lib/db";
import { withAdmin, badRequest, notFound, serverError } from "@/lib/apiGuard";

const parsePrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
};

export const GET = withAdmin(async (req) => {
  try {
    await connect();
    const id = new URL(req.url).searchParams.get("id");

    if (id) {
      if (!mongoose.isValidObjectId(id)) return badRequest("Invalid product id");
      const product = await Product.findById(id);
      if (!product) return notFound("No product with that id");
      return NextResponse.json(product);
    }

    return NextResponse.json(await Product.find().sort({ _id: -1 }));
  } catch (error) {
    return serverError(error, "GET /api/products");
  }
});

export const POST = withAdmin(async (req) => {
  try {
    const { title, description, category, images, price, properties } =
      await req.json();

    if (!title?.trim()) return badRequest("Title is required");

    const parsedPrice = parsePrice(price);
    if (parsedPrice === null) return badRequest("Price must be a positive number");

    if (category && !mongoose.isValidObjectId(category)) {
      return badRequest("Invalid category id");
    }

    await connect();
    const product = await Product.create({
      title,
      description,
      properties,
      category: category || undefined,
      images,
      price: parsedPrice,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return serverError(error, "POST /api/products");
  }
});

export const PUT = withAdmin(async (req) => {
  try {
    const { title, description, properties, category, images, price, _id } =
      await req.json();

    if (!mongoose.isValidObjectId(_id)) return badRequest("Invalid product id");
    if (!title?.trim()) return badRequest("Title is required");

    const parsedPrice = parsePrice(price);
    if (parsedPrice === null) return badRequest("Price must be a positive number");

    if (category && !mongoose.isValidObjectId(category)) {
      return badRequest("Invalid category id");
    }

    await connect();
    const updated = await Product.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        properties,
        category: category || undefined,
        images,
        price: parsedPrice,
      },
      { new: true }
    );

    if (!updated) return notFound("No product with that id");
    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error, "PUT /api/products");
  }
});
