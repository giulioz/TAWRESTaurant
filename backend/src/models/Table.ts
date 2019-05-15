const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tableSchema = new Schema({
  number: Number,
  seats: Number,
  busy: Boolean
});

export default mongoose.model("Table", tableSchema);
