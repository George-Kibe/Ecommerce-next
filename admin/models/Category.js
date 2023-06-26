const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: { type: String, require: true},
    parentCategory: {type:mongoose.Types.ObjectId, ref:"category", require: false}
},
{timestamps: true}
)

const Category = mongoose.models.category || mongoose.model('category', CategorySchema);

export default Category