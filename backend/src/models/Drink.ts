const mongoose = require("mongoose");
const Product = require("./Product");

const drinkSchema = Product.discriminator({}, { discriminatorKey: "kind" });

export default mongoose.model("Drink", drinkSchema);
