import mongoose = require("mongoose");
import { CookModel, FoodModel, FoodOrderModel, TableModel } from "./models";
import { Cook } from "./models/user";
import { Food } from "./models/menuItem";
import { Table, TableStatus } from "./models/table";
const util = require("util");

(async () => {
  await mongoose.connect("mongodb://localhost:27017/tawrestaurant", {
    useNewUrlParser: true
  });
  console.log("Connected to MongoDB");

  /* */
  const chef = new CookModel({
    username: "ac",
    name: "Antonino",
    surname: "Canavacciuolo"
  });
  chef.setPassword("secret");
  try {
    await chef.save();
    console.log("user created !");
  } catch (error) {
    console.error("Unable to create user: " + error);
    process.exit();
  } /* */

  /* */
  const roast: Food = new FoodModel({
    name: "Chicken roast",
    price: 12,
    preparationTime: 24
  });
  try {
    await roast.save();
    console.log("roast saved !");
  } catch (error) {
    console.error("Unable to save roast: " + error);
    process.exit();
  } /* */

  /* */
  const cook: Cook = await CookModel.findOne();
  console.log(util.inspect(cook));

  const food: Food = await FoodModel.findOne();
  console.log(util.inspect(food));

  const order = new FoodOrderModel({
    food: food,
    cook: chef
  }); /* */

  /* */
  const table2: Table = new TableModel({
    number: 2,
    seats: 4
  });
  try {
    await table2.save();
    console.log("table 2 saved !");
  } catch (error) {
    console.error("Unable to save table 2: " + error);
    process.exit();
  }

  const table7: Table = new TableModel({
    number: 7,
    seats: 5,
    status: TableStatus.Served,
    numOfCustomers: 4,
    orders: [order],
    ordersTakenAt: new Date(),
    foodReady: false,
    beverageReady: true
  });
  try {
    await table7.save();
    console.log("table 7 saved !");
  } catch (error) {
    console.error("Unable to save table 7: " + error);
    process.exit();
  } /* */

  const tables: Table[] = await TableModel.find()
    .populate("orders.food")
    .populate("orders.cook")
    .populate("orders.beverage")
    .populate("orders.barman");
  console.log(util.inspect(tables, { showHidden: false, depth: null }));
})();
