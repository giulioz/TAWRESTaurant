import { enumHasValue } from "../../helpers/enumHasValue";
import { UserRole } from "../user";
import { isUndefined } from "util";

export type CreateTableForm = {
  number: Number;
  seats: Number;
};

export enum ChangeStatus {
  Occupy = "occupy",
  Free = "free"
}

export function isCreateTableForm(arg: any): arg is CreateTableForm {
  return (
    arg &&
    arg.number &&
    typeof arg.number === "number" &&
    arg.seats &&
    typeof arg.seats === "number" &&
    arg.seats > 0
  );
}

export function isOccupyFreeRequest(arg: any): boolean {
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
