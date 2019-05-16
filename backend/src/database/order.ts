import mongoose = require("mongoose");
import { Cook, Barman } from "./user";
import { Food, Beverage } from "./menuItem";

type BaseOrder = mongoose.Document & {
  readonly _id: mongoose.Schema.Types.ObjectId;
  status: OrderStatus;
};

export enum OrderStatus {
  Pending = "pending",
  Preparing = "preparing",
  Ready = "ready"
}

export type FoodOrder = BaseOrder & {
  kind: "FoodOrder";
  food: Food;
  cook: Cook;
};

export type BeverageOrder = BaseOrder & {
  kind: "BeverageOrder";
  beverage: Beverage;
  barman: Barman;
};

export type Order = FoodOrder | BeverageOrder;

export const orderSchema: mongoose.Schema<Order> = new mongoose.Schema(
  {
    status: {
      type: mongoose.Schema.Types.String,
      required: false,
      default: OrderStatus.Pending
    }
  },
  { discriminatorKey: "kind" }
);

export const foodOrderSchema: mongoose.Schema<FoodOrder> = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: false,
    default: null
  },
  cook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cook",
    required: false,
    default: null
  }
});
export const beverageOrderSchema: mongoose.Schema<
  BeverageOrder
> = new mongoose.Schema({
  beverage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beverage",
    required: false,
    default: null
  },
  barman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barman",
    required: false,
    default: null
  }
});
