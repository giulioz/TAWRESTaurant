import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { error } from "../helpers/error";
import { TableModel } from "../models";
import { UserRole } from "../models/user";
import {
  isCreateTableForm,
  isOccupyFreeRequest,
  ChangeStatus
} from "../models/forms/table";
import { Table, TableStatus, isTableStatus } from "../models/table";
import { ObjectId } from "bson";
import { isOrderStatus } from "../models/order";
import { Route } from ".";
import { addParams } from "../middlewares/addParams";
import { tableByIdOrders as tableByIdOrdersRoute } from "./orders";
import { io } from "../server";

export const tables: Route = {
  path: "/tables",
  middlewares: [jwtAuth],
  subRoutes: [
    {
      path: "/byId/:id",
      middlewares: [addParams("id")],
      subRoutes: [tableByIdOrdersRoute],
      GET: { callback: getTableById },
      PUT: { callback: putChangeStatus },
      DELETE: {
        middlewares: [userHasRole([UserRole.Cashier])],
        callback: deleteTable
      }
    }
  ],
  GET: { callback: getTables },
  POST: {
    middlewares: [userHasRole([UserRole.Cashier])],
    callback: createTable
  }
};

function getTables(req, res, next) {
  const {
    seats,
    status,
    servedById,
    foodOrdersStatus,
    beverageOrdersStatus
  } = req.query;
  const filter = {};
  if (seats) {
    filter["seats"] = { $gte: parseInt(seats) };
  }
  if (status && isTableStatus(status)) {
    filter["status"] = status;
  }
  if (servedById && ObjectId.isValid(servedById)) {
    filter["servedBy"] = servedById;
  }
  if (foodOrdersStatus && isOrderStatus(foodOrdersStatus)) {
    filter["foodOrdersStatus"] = servedById;
  }
  if (beverageOrdersStatus && isOrderStatus(beverageOrdersStatus)) {
    filter["beverageOrdersStatus"] = servedById;
  }

  TableModel.find(filter)
    .then(tables => {
      return res.json(tables);
    })
    .catch(err => {
      return next(err);
    });
}

function getTableById(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.id })
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      return res.json(table);
    })
    .catch(err => {
      return next(err);
    });
}

function createTable(req, res, next) {
  if (!isCreateTableForm(req.body)) {
    return res.status(400).json(error("Bad request"));
  }

  let table: Table;
  table = new TableModel(req.body);
  table
    .save()
    .then(() => {
      return res.json(table);
    })
    .catch(err => {
      return next(err);
    });
}

function putChangeStatus(req, res, next) {
  io.to("waiters").emit("test", { ciao: "a te da tables" });
  console.log(typeof req.query.customers);
  if (!isOccupyFreeRequest(req)) {
    return res.status(400).json(error("Bad request"));
  }

  TableModel.findOne({ _id: req.urlParams.id })
    .then((table: Table) => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      if (req.query.action === ChangeStatus.Occupy) {
        table.status = TableStatus.NotServed;
        table.numOfCustomers = parseInt(req.query.customers);
      } else {
        table.status = TableStatus.Free;
        table.numOfCustomers = 0;
        table.servedBy = null;
        table.orders = null;
        table.ordersTakenAt = null;
        table.foodOrdersStatus = null;
        table.beverageOrdersStatus = null;
      }
      table
        .save()
        .then(() => {
          if (table.status === TableStatus.NotServed) {
            io.to("waiters").emit("test", { ciao: "a te da tables occupy" });
            io.to(UserRole.Cashier).emit("table is occupied", table);
            io.to(UserRole.Waiter).emit("table is occupied", table);
          } else {
            io.to("waiters").emit("test", { ciao: "a te da tables free" });
            io.to(UserRole.Cashier).emit("table is free", table);
            io.to(UserRole.Waiter).emit("table is free", table);
          }
          return res.send();
        })
        .catch(err => {
          return next(err);
        });
    })
    .catch(err => {
      return next(err);
    });
}

function deleteTable(req, res, next) {
  TableModel.findOne({ _id: req.urlParams.id })
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      TableModel.deleteOne({ _id: req.urlParams.id })
        .then(() => {
          return res.send();
        })
        .catch(err => {
          return next(err);
        });
    })
    .catch(err => {
      return next(err);
    });
}
