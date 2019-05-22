import mongoose = require("mongoose");
import {
  User,
  userSchema,
  Waiter,
  waiterSchema,
  Cook,
  cookSchema,
  Barman,
  barmanSchema,
  Casher,
  casherSchema
} from "./user";
import {
  MenuItem,
  menuItemSchema,
  Food,
  foodSchema,
  Beverage,
  beverageSchema
} from "./menuItem";
import {
  FoodOrder,
  foodOrderSchema,
  BeverageOrder,
  beverageOrderSchema
} from "./order";
import { Table, tableSchema } from "./table";

// user models

export const userModel: mongoose.Model<User> = mongoose.model(
  "User",
  userSchema
);

export const waiterModel: mongoose.Model<Waiter> = userModel.discriminator(
  "Waiter",
  waiterSchema
);

export const cookModel: mongoose.Model<Cook> = userModel.discriminator(
  "Cook",
  cookSchema
);

export const barmanModel: mongoose.Model<Barman> = userModel.discriminator(
  "Barman",
  barmanSchema
);

export const casherModel: mongoose.Model<Casher> = userModel.discriminator(
  "Casher",
  casherSchema
);

// menuItem models

export const menuItemModel: mongoose.Model<MenuItem> = mongoose.model(
  "MenuItem",
  menuItemSchema
);

export const foodModel: mongoose.Model<Food> = menuItemModel.discriminator(
  "Food",
  foodSchema
);

export const beverageModel: mongoose.Model<
  Beverage
> = menuItemModel.discriminator("Beverage", beverageSchema);

// table/order models

const tableOrdersPath: mongoose.Schema.Types.DocumentArray = <
  mongoose.Schema.Types.DocumentArray
>tableSchema.path("orders");

export const foodOrderModel: mongoose.Model<
  FoodOrder
> = tableOrdersPath.discriminator("FoodOrder", foodOrderSchema);

export const beverageOrderModel: mongoose.Model<
  BeverageOrder
> = tableOrdersPath.discriminator("BeverageOrder", beverageOrderSchema);

export const tableModel: mongoose.Model<Table> = mongoose.model(
  "Table",
  tableSchema
);
