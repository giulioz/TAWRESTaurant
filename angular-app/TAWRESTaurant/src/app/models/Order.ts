import { enumHasValue } from "../helpers/enumHasValue";
import { Cook, Barman } from "./User";
import { Food, Beverage } from "./MenuItem";
import { Table } from "./Table";

export enum OrderKind {
  FoodOrder = "FoodOrder",
  BeverageOrder = "BeverageOrder"
}

export function isOrderKind(arg: any): arg is OrderKind {
  return arg && typeof arg === "string" && enumHasValue(OrderKind, arg);
}

export type Order = {
  readonly _id: string;
  table: Table;
  status: OrderStatus;
  kind: OrderKind;
};

export enum OrderStatus {
  Pending = "pending",
  Preparing = "preparing",
  Ready = "ready"
}

export function isOrderStatus(arg: any): arg is OrderStatus {
  return arg && typeof arg === "string" && enumHasValue(OrderStatus, arg);
}

export type FoodOrder = Order & {
  kind: OrderKind.FoodOrder;
  food: Food;
  cook: Cook;
};

export type BeverageOrder = Order & {
  kind: OrderKind.BeverageOrder;
  beverage: Beverage;
  barman: Barman;
};
