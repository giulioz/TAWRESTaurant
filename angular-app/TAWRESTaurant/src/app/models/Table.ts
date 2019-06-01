import { enumHasValue } from "../helpers/enumHasValue";
import { Waiter } from "./User";
import { Order } from "./Order";

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

export type Table = {
  readonly _id: string;
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
