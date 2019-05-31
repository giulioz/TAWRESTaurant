import { Route } from ".";
import {
  TableModel,
  OrderModel,
  FoodOrderModel,
  BeverageOrderModel
} from "../models";
import { error } from "../helpers/error";
import { TableStatus } from "../models/table";
import { OrderStatus, OrderKind } from "../models/order";
import { UserRole } from "../models/user";
import { addParams } from "../middlewares/addParams";
import { io } from "../server";
import { Socket } from "socket.io";

const tableFoodOrders: Route = {
  path: "/foodOrders",
  GET: { callback: getTableByIdFoodOrders },
  POST: { callback: postTableByIdFoodOrders }
};

const tableBeverageOrders: Route = {
  path: "/beverageOrders",
  GET: { callback: getTableByIdBeverageOrders },
  POST: { callback: postTableByIdBeverageOrders }
};

export const tableByIdOrders: Route = {
  path: "/orders",
  subRoutes: [
    {
      path: "/byId/:ido",
      middlewares: [addParams("ido")],
      GET: { callback: getTableByIdOrderById },
      PUT: { callback: putTableByIdOrderById },
      DELETE: { callback: deleteTableByIdOrderById }
    },
    tableFoodOrders,
    tableBeverageOrders
  ],
  GET: { callback: getTableByIdOrders },
  PUT: { callback: putTableByIdChangeStatus }
};

function getTableByIdOrders(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.id })
    .populate("orders")
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      return res.json(
        table.orders.filter(order => {
          if (!req.query.status || order.status === req.query.status)
            return true;
          return false;
        })
      );
    })
    .catch(err => {
      return next(err);
    });
}

function putTableByIdChangeStatus(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.id })
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      if (table.orders.length == 0)
        return res.status(404).json(error("Orders not found"));
      table.status = TableStatus.Waiting;
      table.ordersTakenAt = new Date();
      table
        .save()
        .then(() => {
          return res.json(table);
        })
        .catch(err => {
          next(err);
        });
      let serverIo: Socket = io;
      serverIo.to(UserRole.Barman).emit("orders are taken", table);
      serverIo.to(UserRole.Cook).emit("orders are taken", table);
    })
    .catch(err => {
      return next(err);
    });
}

function getTableByIdOrderById(req, res) {
  OrderModel.findOne({ _id: req.urlParams.ido, table: req.urlParams.id }).then(
    order => {
      if (!order) return res.status(404).json(error("Order not found"));
      return res.json(order);
    }
  );
}

function putTableByIdOrderById(req, res, next) {
  OrderModel.findOne({
    _id: req.urlParams.ido,
    table: req.urlParams.id
  }).then((order: any) => {
    if (!order) return res.status(404).json(error("Order not found"));
    if (req.query.action === "assign") {
      order.status = OrderStatus.Preparing;
      if (req.user.role === UserRole.Cook && order.kind === OrderKind.FoodOrder)
        order.cook = req.user._id;
      if (
        req.user.role === UserRole.Barman &&
        order.kind === OrderKind.BeverageOrder
      )
        order.barman = req.user._id;
    }
    if (req.query.action === "notify") {
      order.status = OrderStatus.Ready;
    }
    order
      .save()
      .then(() => {
        let serverIo: Socket = io;
        if (order.status === OrderStatus.Ready) {
          serverIo.to(UserRole.Waiter).emit("order is ready", order);
          OrderModel.countDocuments({
            table: order.table,
            status: { $not: OrderStatus.Ready }
          }); //TODO
        } else {
          serverIo.to(req.user.role).emit("order is preparing", order);
        }
        res.json(order);
      })
      .catch(err => next(err));
  });
}

function deleteTableByIdOrderById(req, res, next) {
  OrderModel.count({
    _id: req.urlParams.ido,
    table: req.urlParams.id
  }).then(count => {
    if (count > 0)
      OrderModel.deleteOne({ _id: req.urlParams.ido })
        .then(() => {
          res.send();
        })
        .catch(err => next(err));
    else res.status(404).json(error("Order not found"));
  });
}

function getTableByIdFoodOrders(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.id })
    .populate("orders")
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      return res.json(
        table.orders.filter(order => {
          if (
            (!req.query.status || order.status === req.query.status) &&
            order.kind === OrderKind.FoodOrder
          )
            return true;
          return false;
        })
      );
    })
    .catch(err => {
      return next(err);
    });
}

function postTableByIdFoodOrders(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.id })
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      req.body.table = table._id;
      req.body.kind = OrderKind.FoodOrder;
      let order = new FoodOrderModel(req.body);
      order.save().then(() => {
        table.orders.push(order._id);
        table
          .save()
          .then(() => {
            return res.json(order);
          })
          .catch(err => {
            OrderModel.deleteOne({ _id: order.id })
              .then(() => {
                next(err);
              })
              .catch(err => next(err));
          });
      });
    })
    .catch(err => {
      return next(err);
    });
}

function getTableByIdBeverageOrders(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.id })
    .populate("orders")
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      return res.json(
        table.orders.filter(order => {
          if (
            (!req.query.status || order.status === req.query.status) &&
            order.kind === OrderKind.BeverageOrder
          )
            return true;
          return false;
        })
      );
    })
    .catch(err => {
      return next(err);
    });
}

function postTableByIdBeverageOrders(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.id })
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      req.body.table = table._id;
      req.body.kind = OrderKind.BeverageOrder;
      let order = new BeverageOrderModel(req.body);
      order.save().then(() => {
        table.orders.push(order._id);
        table
          .save()
          .then(() => {
            return res.json(order);
          })
          .catch(err => {
            OrderModel.deleteOne({ _id: order.id })
              .then(() => {
                next(err);
              })
              .catch(err => next(err));
          });
      });
    })
    .catch(err => {
      return next(err);
    });
}
