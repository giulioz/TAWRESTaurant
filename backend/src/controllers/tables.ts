import express = require("express");
import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { error } from "../helpers/error";
import {
  TableModel,
  OrderModel,
  FoodOrderModel,
  BeverageOrderModel
} from "../models";
import { UserRole } from "../models/user";
import {
  isCreateTableForm,
  isChangeStatusRequest,
  ChangeStatus
} from "../models/forms/table";
import { isTableStatus, Table, TableStatus } from "../models/table";
import { ObjectId } from "bson";
import { isOrderStatus, OrderKind, OrderStatus } from "../models/order";

const router = express.Router();

router.use(jwtAuth);

router.get("/", getTables);

router.get("/byId/:id", getTableById);

router
  .route("/byId/:id/orders")
  .get((req, res, next) => {
    TableModel.findOne({ _id: req.params.id })
      .populate("orders")
      .then(table => {
        if (!table) {
          return res.status(404).json(error("Table not found"));
        }
        return res.json(
          table.orders.map(order => {
            if (!req.query.status || order.status === req.query.status)
              return order;
          })
        );
      })
      .catch(err => {
        return next(err);
      });
  })
  .put((req, res, next) => {
    TableModel.findOne({ _id: req.params.id })
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

        //TODO socket.io event notify barmans and cooks
      })
      .catch(err => {
        return next(err);
      });
  });

router
  .route("/byId/:id/orders/byId/:ido")
  .get((req, res) => {
    OrderModel.findOne({ _id: req.params.ido, table: req.params.id }).then(
      order => {
        if (!order) return res.status(404).json(error("Order not found"));
        return res.json(order);
      }
    );
  })
  .put((req, res, next) => {
    OrderModel.findOne({ _id: req.params.ido, table: req.params.id }).then(
      (order: any) => {
        if (!order) return res.status(404).json(error("Order not found"));
        if (req.query.action === "assign") {
          order.status = OrderStatus.Preparing;
          if (
            req.user.role === UserRole.Cook &&
            order.kind === OrderKind.FoodOrder
          )
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
          .then(() => res.json(order))
          .catch(err => next(err));
      }
    );
  })
  .delete((req, res, next) => {
    OrderModel.count({ _id: req.params.ido, table: req.params.id }).then(
      count => {
        if (count > 0)
          OrderModel.deleteOne({ _id: req.params.ido })
            .then(() => {
              res.send();
            })
            .catch(err => next(err));
        else res.status(404).json(error("Order not found"));
      }
    );
  });

router
  .route("/byId/:id/orders/foodOrders")
  .get((req, res, next) => {
    TableModel.findOne({ _id: req.params.id })
      .populate("orders")
      .then(table => {
        if (!table) {
          return res.status(404).json(error("Table not found"));
        }
        console.log(table.orders);
        return res.json(
          table.orders.map(order => {
            console.log(order);
            if (
              (!req.query.status || order.status === req.query.status) &&
              order.kind === OrderKind.FoodOrder
            ) {
              return order;
            }
          })
        );
      })
      .catch(err => {
        return next(err);
      });
  })
  .post((req, res, next) => {
    TableModel.findOne({ _id: req.params.id })

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
  });

router
  .route("/byId/:id/orders/beverageOrders")
  .get((req, res, next) => {
    TableModel.findOne({ _id: req.params.id })
      .populate("orders")
      .then(table => {
        if (!table) {
          return res.status(404).json(error("Table not found"));
        }
        return res.json(
          table.orders.map(order => {
            if (
              (!req.query.status || order.status === req.query.status) &&
              order.kind === OrderKind.BeverageOrder
            )
              return order;
          })
        );
      })
      .catch(err => {
        return next(err);
      });
  })
  .post((req, res, next) => {
    TableModel.findOne({ _id: req.params.id })

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
  });

router.post("/", userHasRole([UserRole.Cashier]), createTable);

router.put(
  "/:id",
  userHasRole([UserRole.Cashier, UserRole.Waiter]),
  changeStatus
);

router.delete("/:id", userHasRole([UserRole.Cashier]), deleteTable);

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
        table.foodOrdersStatus = null;
        table.beverageOrdersStatus = null;
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
