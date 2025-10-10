import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["home", "office", "other"],
    default: "home",
  },

  line1: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

export default mongoose.model("Address", addressSchema);
