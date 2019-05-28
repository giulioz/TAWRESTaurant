import mongoose = require("mongoose");
import { enumHasValue } from "../helpers/enumHasValue";

export enum MenuItemKind {
  Food = "Food",
  Beverage = "Beverage"
}

export function isMenuItemKind(arg: any): arg is MenuItemKind {
  return arg && typeof arg === "string" && enumHasValue(MenuItemKind, arg);
}

export type MenuItem = mongoose.Document & {
  readonly _id: mongoose.Schema.Types.ObjectId;
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

export const menuItemSchema: mongoose.Schema<MenuItem> = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    price: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    preparationTime: {
      type: mongoose.Schema.Types.Number,
      required: true
    }
  },
  { discriminatorKey: "kind" }
);

export const foodSchema: mongoose.Schema<Food> = new mongoose.Schema({});

export const beverageSchema: mongoose.Schema<Beverage> = new mongoose.Schema(
  {}
);
