import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { error } from "../helpers/error";
import { TableModel } from "../models";
import { UserRole } from "../models/user";
import {
  isCreateTableForm,
  isChangeStatusRequest,
  ChangeStatus
} from "../models/forms/table";
import { isTableStatus, Table, TableStatus } from "../models/table";
import { ObjectId } from "bson";
import { isOrderStatus } from "../models/order";
import { Route } from ".";
import { addParams } from "../middlewares/addParams";
import { tableByIdOrders as tableByIdOrdersRoute } from "./orders";
import { io } from "../server";
import { Socket } from "socket.io";

export const tables: Route = {
  path: "/tables",
  middlewares: [jwtAuth],
  subRoutes: [
    {
      path: "/byId/:id",
      middlewares: [addParams("id")],
      subRoutes: [tableByIdOrdersRoute],
      GET: { callback: getTableById },
      PUT: { callback: changeStatus },
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
    tableStatus,
    waiterId,
    foodOrdersStatus,
    beverageOrdersStatus
  } = req.query;
  const filter = {};
  if (seats) {
    filter["seats"] = { $gte: parseInt(seats) };
  }
  if (tableStatus && isTableStatus(tableStatus)) {
    filter["tableStatus"] = tableStatus;
  }
  if (waiterId && ObjectId.isValid(waiterId)) {
    filter["servedBy"] = waiterId;
  }
  if (foodOrdersStatus && isOrderStatus(foodOrdersStatus)) {
    filter["foodOrdersStatus"] = waiterId;
  }
  if (beverageOrdersStatus && isOrderStatus(beverageOrdersStatus)) {
    filter["beverageOrdersStatus"] = waiterId;
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

function changeStatus(req, res, next) {
  if (!isChangeStatusRequest(req)) {
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
          let serverIo: Socket = io;
          serverIo.emit("test", { ciao: "a te" });
          if (table.status === TableStatus.NotServed) {
            serverIo.to(UserRole.Cashier).emit("table is occupied", table);
            serverIo.to(UserRole.Waiter).emit("table is occupied", table);
          } else {
            serverIo.to(UserRole.Cashier).emit("table is free", table);
            serverIo.to(UserRole.Waiter).emit("table is free", table);
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
