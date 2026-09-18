import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Category from "@/models/Category";
import Product from "@/models/Product";
import connect from "@/lib/db";
import { withAdmin, badRequest, notFound, serverError } from "@/lib/apiGuard";

export const DELETE = withAdmin(async (request, { params }) => {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return badRequest("Invalid category id");

  try {
    await connect();

    // Refuse to orphan data rather than silently leaving products and child
    // categories pointing at an id that no longer exists.
    const [childCount, productCount] = await Promise.all([
      Category.countDocuments({ parentCategory: id }),
      Product.countDocuments({ category: id }),
    ]);

    if (childCount > 0) {
      return badRequest("Cannot delete a category that still has subcategories");
    }
    if (productCount > 0) {
      return badRequest(
        `Cannot delete a category still used by ${productCount} product(s)`
      );
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return notFound("No category with that id");

    return NextResponse.json({ message: "Category has been deleted" });
  } catch (error) {
    return serverError(error, "DELETE /api/categories/[id]");
  }
});
