const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    salt: String,
    name: String,
    surname: String
  },
  {
    discriminatorKey: "kind"
  }
);

export default mongoose.model("User", userSchema);
