const mongoose = require("mongoose");
const User = require("./User");

const cookSchema = User.discriminator(
  {
    totalPreparedDishes: Number
  },
  { discriminatorKey: "kind" }
);

export default mongoose.model("Cook", cookSchema);
