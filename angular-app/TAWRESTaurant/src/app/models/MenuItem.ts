import { enumHasValue } from "../helpers/enumHasValue";

export enum MenuItemKind {
  Food = "Food",
  Beverage = "Beverage"
}

export function isMenuItemKind(arg: any): arg is MenuItemKind {
  return arg && typeof arg === "string" && enumHasValue(MenuItemKind, arg);
}

export type MenuItem = {
  readonly _id: string;
  name: string;
  price: number;
  preparationTime: number;
  kind: MenuItemKind;
};

export type Food = MenuItem & {
  kind: MenuItemKind.Food;
};

export type Beverage = MenuItem & {
  kind: MenuItemKind.Beverage;
};
