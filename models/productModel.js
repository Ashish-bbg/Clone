import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: String,
  price: {
    type: Number,
    require: true,
  },
  category: String,
  brand: String,
  stock: {
    type: Number,
    default: 10,
  },
  images: [String],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  avgRating: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Product", productSchema);
