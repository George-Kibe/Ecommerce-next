const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: { type: String, require: true},
    description: String,
    category: {type:mongoose.Types.ObjectId, ref:"category", require: false},
    price: {type: Number, require:true},
    images:{type:[String]}
},
{timestamps: true}
)

const Product = mongoose.models.product || mongoose.model('product', ProductSchema);

export default Product