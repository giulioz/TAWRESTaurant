import express = require("express");
import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { error } from "../helpers/error";
import { UserRole } from "../models/user";
import { TableModel, BeverageOrderModel, FoodOrderModel } from "../models";
import { Table } from "../models/table";
import {
  OrderKind,
  Order,
  isOrderKind,
  isOrderStatus,
  orderSchema
} from "../models/order";
import { isCreateOrderForm } from "../models/forms/order";

const router = express.Router();

router.use(jwtAuth);

router.get("/:id/orders", getOrders);

router.get("/:id/orders/:ido", getOrderById);

router.post("/:id/orders", userHasRole([UserRole.Waiter]), createOrder);

router.put(
  "/:id/orders/:ido",
  userHasRole([UserRole.Cook, UserRole.Barman]),
  changeStatus
);

router.delete(
  "/:id/orders/:ido",
  userHasRole([UserRole.Cashier]),
  deleteOrder
);

function getOrders(req, res, next) {
  TableModel.findOne({ _id: req.params.id }).populate({ path: "orders.food orders.beverage" }).then((table: Table) => {
    if (!table) return res.status(404).json(error("Table not found"));

    const { kind, status } = req.query;

    return res.json(
      table.orders.map((val: Order) => {
        if (
          (!isOrderKind(kind) || kind === val.kind) &&
          (!isOrderStatus(status) || status === val.status)
        )
          return val;
      })
    );
  });
}

function getOrderById(req, res, next) {
  TableModel.findOne({ _id: req.params.id }).populate({ path: "orders.food orders.beverage" }).then((table: Table) => {
    if (!table) return res.status(404).json(error("Table not found"));
    var order = table.orders.id(req.params.ido);
    if (!order) return res.status(404).json(error("Order not found"));
    return res.json(order);
  });
}

function createOrder(req, res, next) {
  TableModel.findOne({ _id: req.params.id }).then((table: Table) => {
    if (!table) return res.status(404).json(error("Table not found"));
    if (!isCreateOrderForm(req.body))
      return res.status(400).json(error("Bad request"));

    const { kind: oKind, beverage: oBeverage, food: oFood } = req.body;
    let order: Order;
    switch (oKind) {
      case OrderKind.BeverageOrder:
        order = new BeverageOrderModel({ kind: oKind, beverage: oBeverage });
        break;
      case OrderKind.FoodOrder:
        order = new FoodOrderModel({ kind: oKind, food: oFood });
        break;
    }
    table.orders.push(order);
    table
      .save()
      .then(() => res.send())
      .catch(err => next(err));
  });
}

function changeStatus(req, res, next) { }

function deleteOrder(req, res, next) {
  TableModel.findOne({ _id: req.params.id }).then((table: Table) => {
    if (!table) return res.status(404).json(error("Table not found"));
    var order = table.orders.id(req.params.ido);
    if (!order) return res.status(404).json(error("Order not found"));
    order.remove();
    table
      .save()
      .then(() => {
        return res.send();
      })
      .catch(err => next(err));
  });
}

export default router;
