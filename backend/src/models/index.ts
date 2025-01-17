import mongoose = require("mongoose");
import {
  UserRole,
  User,
  userSchema,
  Waiter,
  waiterSchema,
  Cook,
  cookSchema,
  Barman,
  barmanSchema,
  Cashier,
  cashierSchema
} from "./user";
import {
  MenuItemKind,
  MenuItem,
  menuItemSchema,
  Food,
  foodSchema,
  Beverage,
  beverageSchema
} from "./menuItem";
import {
  OrderKind,
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
  UserRole.Waiter,
  waiterSchema
);

export const CookModel: mongoose.Model<Cook> = UserModel.discriminator(
  UserRole.Cook,
  cookSchema
);

export const BarmanModel: mongoose.Model<Barman> = UserModel.discriminator(
  UserRole.Barman,
  barmanSchema
);

export const CashierModel: mongoose.Model<Cashier> = UserModel.discriminator(
  UserRole.Cashier,
  cashierSchema
);

// menuItem models

export const MenuItemModel: mongoose.Model<MenuItem> = mongoose.model(
  "MenuItem",
  menuItemSchema
);

export const FoodModel: mongoose.Model<Food> = MenuItemModel.discriminator(
  MenuItemKind.Food,
  foodSchema
);

export const BeverageModel: mongoose.Model<
  Beverage
> = MenuItemModel.discriminator(MenuItemKind.Beverage, beverageSchema);

// table/order models

const tableOrdersPath: mongoose.Schema.Types.DocumentArray = <
  mongoose.Schema.Types.DocumentArray
>tableSchema.path("orders");

export const FoodOrderModel: mongoose.Model<
  FoodOrder
> = tableOrdersPath.discriminator(OrderKind.FoodOrder, foodOrderSchema);

export const BeverageOrderModel: mongoose.Model<
  BeverageOrder
> = tableOrdersPath.discriminator(OrderKind.BeverageOrder, beverageOrderSchema);

export const TableModel: mongoose.Model<Table> = mongoose.model(
  "Table",
  tableSchema
);
