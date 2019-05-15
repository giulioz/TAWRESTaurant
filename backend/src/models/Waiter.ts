const mongoose = require("mongoose");
const User = require("./User");

const waiterSchema = User.discriminator(
  {
    totalServedCustomers: Number
  },
  { discriminatorKey: "kind" }
);

export default mongoose.model("Waiter", waiterSchema);
