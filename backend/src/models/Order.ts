const mongoose = require("mongoose");

enum OrderStatus {
  PENDING,
  PREPARING,
  READY
}

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  startTime: Date,
  endTime: Date,
  status: OrderStatus
});

export default mongoose.model("Order", orderSchema);
