import express = require("express");
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

const router = express.Router();

router.use(jwtAuth);

router.get("/", getTables);

router.get("/:id", getTableById);

router.post("/", userHasRole([UserRole.Cashier]), createTable);

router.put(
  "/:id",
  userHasRole([UserRole.Cashier, UserRole.Waiter]),
  changeStatus
);

router.delete("/:id", userHasRole([UserRole.Cashier]), deleteTable);

function getTables(req, res, next) {
  const { seats, status, waiterId } = req.query;
  const filter = {};
  if (seats) {
    filter["seats"] = { $gte: parseInt(seats) };
  }
  if (status && isTableStatus(status)) {
    filter["status"] = status;
  }
  if (waiterId && ObjectId.isValid(waiterId)) {
    filter["servedBy"] = waiterId;
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
  TableModel.findOne({ _id: req.params.id })
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

  TableModel.findOne({ _id: req.params.id })
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
        table.foodReady = false;
        table.beverageReady = false;
      }
      table
        .save()
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

function deleteTable(req, res, next) {
  TableModel.findOne({ _id: req.params.id })
    .then(table => {
      if (!table) {
        return res.status(404).json(error("Table not found"));
      }
      TableModel.deleteOne({ _id: req.params.id })
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

export default router;
