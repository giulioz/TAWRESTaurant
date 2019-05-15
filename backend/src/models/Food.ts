const mongoose = require("mongoose");
const Product = require("./Product");

const foodSchema = Product.discriminator(
  { preparationTime: Number },
  { discriminatorKey: "kind" }
);

export default mongoose.model("Food", foodSchema);
