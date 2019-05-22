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

export const UserModel: mongoose.Model<User> = mongoose.model(
  "User",
  userSchema
);

export const WaiterModel: mongoose.Model<Waiter> = UserModel.discriminator(
  "Waiter",
  waiterSchema
);

export const CookModel: mongoose.Model<Cook> = UserModel.discriminator(
  "Cook",
  cookSchema
);

export const BarmanModel: mongoose.Model<Barman> = UserModel.discriminator(
  "Barman",
  barmanSchema
);

export const CasherModel: mongoose.Model<Casher> = UserModel.discriminator(
  "Casher",
  casherSchema
);

// menuItem models

export const MenuItemModel: mongoose.Model<MenuItem> = mongoose.model(
  "MenuItem",
  menuItemSchema
);

export const FoodModel: mongoose.Model<Food> = MenuItemModel.discriminator(
  "Food",
  foodSchema
);

export const BeverageModel: mongoose.Model<
  Beverage
> = MenuItemModel.discriminator("Beverage", beverageSchema);

// table/order models

const tableOrdersPath: mongoose.Schema.Types.DocumentArray = <
  mongoose.Schema.Types.DocumentArray
>tableSchema.path("orders");

export const FoodOrderModel: mongoose.Model<
  FoodOrder
> = tableOrdersPath.discriminator("FoodOrder", foodOrderSchema);

export const BeverageOrderModel: mongoose.Model<
  BeverageOrder
> = tableOrdersPath.discriminator("BeverageOrder", beverageOrderSchema);

export const TableModel: mongoose.Model<Table> = mongoose.model(
  "Table",
  tableSchema
);
