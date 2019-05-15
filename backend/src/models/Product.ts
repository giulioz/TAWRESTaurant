const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  price: Number
});

export default mongoose.model("Product", productSchema);
