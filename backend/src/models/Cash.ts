const mongoose = require("mongoose");
const User = require("./User");

const cashSchema = User.discriminator({}, { discriminatorKey: "kind" });

export default mongoose.model("Cash", cashSchema);
