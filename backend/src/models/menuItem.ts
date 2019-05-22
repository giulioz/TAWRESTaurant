import mongoose = require("mongoose");

type BaseMenuItem = mongoose.Document & {
  readonly _id: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  preparationTime: number;
};

export type Food = BaseMenuItem & {
  kind: "Food";
};

export type Beverage = BaseMenuItem & {
  kind: "Beverage";
};

export type MenuItem = Food | Beverage;

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
