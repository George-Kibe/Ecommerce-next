import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Category from "@/models/Category";
import connect from "@/lib/db";
import { withAdmin, badRequest, notFound, serverError } from "@/lib/apiGuard";

const normaliseProperties = (properties) =>
  Array.isArray(properties)
    ? properties
        .filter((p) => p?.name?.trim())
        .map((p) => ({
          name: String(p.name).trim(),
          values: Array.isArray(p.values) ? p.values : [],
        }))
    : [];

export const GET = withAdmin(async () => {
  try {
    await connect();
    const categories = await Category.find().populate("parentCategory");
    return NextResponse.json(categories);
  } catch (error) {
    return serverError(error, "GET /api/categories");
  }
});

export const POST = withAdmin(async (req) => {
  try {
    const { name, parentCategory, properties } = await req.json();

    if (!name?.trim()) return badRequest("Category name is required");
    if (parentCategory && !mongoose.isValidObjectId(parentCategory)) {
      return badRequest("Invalid parent category id");
    }

    await connect();
    const category = await Category.create({
      name: name.trim(),
      parentCategory: parentCategory || undefined,
      properties: normaliseProperties(properties),
    });

    // Return JSON rather than passing the Mongoose document straight to
    // NextResponse, which used to serialise it as an inspected object string.
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return serverError(error, "POST /api/categories");
  }
});

export const PUT = withAdmin(async (req) => {
  try {
    const { _id, name, parentCategory, properties } = await req.json();

    if (!mongoose.isValidObjectId(_id)) return badRequest("Invalid category id");
    if (!name?.trim()) return badRequest("Category name is required");
    if (parentCategory && !mongoose.isValidObjectId(parentCategory)) {
      return badRequest("Invalid parent category id");
    }
    if (parentCategory && String(parentCategory) === String(_id)) {
      return badRequest("A category cannot be its own parent");
    }

    await connect();
    const updated = await Category.findByIdAndUpdate(
      _id,
      {
        name: name.trim(),
        parentCategory: parentCategory || undefined,
        properties: normaliseProperties(properties),
      },
      { new: true }
    );

    if (!updated) return notFound("No category with that id");
    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error, "PUT /api/categories");
  }
});
