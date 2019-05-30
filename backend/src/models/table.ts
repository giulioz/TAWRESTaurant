import mongoose = require("mongoose");
import { enumHasValue } from "../helpers/enumHasValue";
import { UserRole, Waiter } from "./user";
import { Order } from "./order";

export enum TableStatus {
  Free = "free",
  NotServed = "not-served",
  Waiting = "waiting",
  Served = "served"
}

export function isTableStatus(arg: any): arg is TableStatus {
  return arg && typeof arg === "string" && enumHasValue(TableStatus, arg);
}

export enum TableOrdersStatus {
  Pending = "pending",
  Ready = "ready",
  Served = "served"
}

export function isTableOrderStatus(arg: any): arg is TableStatus {
  return arg && typeof arg === "string" && enumHasValue(TableOrdersStatus, arg);
}

export type Table = mongoose.Document & {
  readonly _id: mongoose.Schema.Types.ObjectId;
  number: number;
  seats: number;
  status: TableStatus;
  numOfCustomers: number;
  servedBy: Waiter;
  orders: Order[];
  ordersTakenAt: Date;
  foodOrdersStatus: TableOrdersStatus;
  foodsReadyAt: Date;
  beverageOrdersStatus: TableOrdersStatus;
  beveragesReadyAt: Date;
};

export const tableSchema: mongoose.Schema<Table> = new mongoose.Schema({
  number: { type: mongoose.Schema.Types.Number, required: true, unique: true },
  seats: { type: mongoose.Schema.Types.Number, required: true },
  status: {
    type: mongoose.Schema.Types.String,
    required: false,
    default: TableStatus.Free
  },
  numOfCustomers: {
    type: mongoose.Schema.Types.Number,
    required: false,
    default: 0
  },
  servedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserRole.Waiter,
    required: false,
    default: null
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  ordersTakenAt: {
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  },
  foodOrdersStatus: {
    type: mongoose.Schema.Types.String,
    required: false,
    default: null
  },
  foodsReadyAt: {
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  },
  beverageOrdersStatus: {
    type: mongoose.Schema.Types.String,
    required: false,
    default: null
  },
  beveragesReadyAt: {
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null
  }
});
