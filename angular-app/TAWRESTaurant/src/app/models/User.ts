import { enumHasValue } from "../helpers/enumHasValue";

export enum UserRole {
  Waiter = "Waiter",
  Cook = "Cook",
  Barman = "Barman",
  Cashier = "Cashier"
}

export function isUserRole(arg: any): arg is UserRole {
  return arg && typeof arg === "string" && enumHasValue(UserRole, arg);
}

export type User = {
  readonly _id: string;
  username: string;
  name: string;
  surname: string;
  role: UserRole;
};

export type Waiter = User & {
  role: UserRole.Waiter;
  totalServedCustomers: number;
};

export type Cook = User & {
  role: UserRole.Cook;
  totalPreparedDishes: number;
};

export type Barman = User & {
  role: UserRole.Barman;
  totalPreparedBeverages: number;
};

export type Cashier = User & {
  role: UserRole.Cashier;
};
