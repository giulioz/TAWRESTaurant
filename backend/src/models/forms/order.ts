import { enumHasValue } from "../../utils";
import { UserRole } from "../user";
import { isOrderKind, OrderKind } from "../order";
import { ObjectId } from "bson";

export type CreateOrderForm = {
  number: Number;
  seats: Number;
};

export enum ChangeStatus {
  Occupy = "occupy",
  Free = "free"
}

export function isCreateOrderForm(arg: any): arg is CreateOrderForm {
  return (
    arg &&
    arg.kind &&
    typeof arg.kind === "string" &&
    isOrderKind(arg.kind) &&
    ((arg.kind === OrderKind.BeverageOrder && ObjectId.isValid(arg.beverage)) ||
      (arg.kind === OrderKind.FoodOrder && ObjectId.isValid(arg.food)))
  );
}

export function isChangeStatusRequest(arg: any): boolean {
  const { query, user } = arg;
  return (
    arg &&
    query.action &&
    enumHasValue(ChangeStatus, query.action) &&
    /*
    middleware verifies that only Cashiers and Waiter can access the endpoint that uses this function
    user.role &&
    enumHasValue(user.role, UserRole) &&
    */
    ((query.customers &&
      typeof query.customers === "string" &&
      !isNaN(query.customers) &&
      parseInt(query.customers) > 0 &&
      user.role === UserRole.Waiter &&
      query.action === ChangeStatus.Occupy) ||
      (user.role === UserRole.Cashier && query.action === ChangeStatus.Free))
  );
}
