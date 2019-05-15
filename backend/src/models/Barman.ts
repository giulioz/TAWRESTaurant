const mongoose = require("mongoose");
const User = require("./User");

const barmanSchema = User.discriminator(
  {
    totalPreparedDrinks: Number
  },
  { discriminatorKey: "kind" }
);

export default mongoose.model("Barman", barmanSchema);
