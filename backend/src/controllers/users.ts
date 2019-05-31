import express = require("express");
import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { error } from "../helpers/error";
import {
  UserModel,
  WaiterModel,
  CookModel,
  BarmanModel,
  CashierModel,
  BeverageOrderModel,
  FoodOrderModel,
  TableModel
} from "../models";
import { UserRole, isUserRole, User } from "../models/user";
import { isCreateUserForm, isChangePasswordForm } from "../models/forms/user";
import { Route } from "./RESTaurantAPI";
import { addParams } from "../middlewares/addParams";

const barmans: Route = {
  path: "/barmans",
  subRoutes: [
    {
      path: "/byId/:id/orders",
      middleware: [addParams("id", "id")],
      GET: {
        callback: (req, res) => {
          let id = req.urlParams.id;
          BeverageOrderModel.find({ barman: id }).then(orders => {
            res.json(orders);
          });
        }
      }
    }
  ],
  GET: {
    middleware: [
      (req, res, next) => {
        req.query.role = UserRole.Barman;
        next();
      }
    ],
    callback: getUsers
  },
  POST: {
    middleware: [
      userHasRole([UserRole.Cashier]),
      (req, res, next) => {
        req.body.role = UserRole.Barman;
        next();
      }
    ],
    callback: createUser
  }
};

const cashiers: Route = {
  path: "/cashiers",
  GET: {
    middleware: [
      (req, res, next) => {
        req.query.role = UserRole.Cashier;
        next();
      }
    ],
    callback: getUsers
  },
  POST: {
    middleware: [
      userHasRole([UserRole.Cashier]),
      (req, res, next) => {
        req.body.role = UserRole.Cashier;
        next();
      }
    ],
    callback: createUser
  }
};

const cooks: Route = {
  path: "/cooks",
  subRoutes: [
    {
      path: "/byId/:id/orders",
      middleware: [addParams("id", "id")],
      GET: {
        callback: (req, res) => {
          let id = req.urlParams.id;
          FoodOrderModel.find({ cook: id }).then(orders => {
            res.json(orders);
          });
        }
      }
    }
  ],
  GET: {
    middleware: [
      (req, res, next) => {
        req.query.role = UserRole.Cook;
        next();
      }
    ],
    callback: getUsers
  },
  POST: {
    middleware: [
      userHasRole([UserRole.Cashier]),
      (req, res, next) => {
        req.body.role = UserRole.Cook;
        next();
      }
    ],
    callback: createUser
  }
};

const waiters: Route = {
  path: "/waiters",
  subRoutes: [
    {
      path: "/byId/:id/orders",
      GET: {
        middleware: [addParams("id", "id")],
        callback: (req, res) => {
          let id = req.urlParams.id;
          TableModel.find({ servedBy: id }).then(tables => {
            res.json(tables);
          });
        }
      }
    }
  ],
  GET: {
    middleware: [
      (req, res, next) => {
        req.query.role = UserRole.Waiter;
        next();
      }
    ],
    callback: getUsers
  },
  POST: {
    middleware: [
      userHasRole([UserRole.Cashier]),
      (req, res, next) => {
        req.body.role = UserRole.Waiter;
        next();
      }
    ],
    callback: createUser
  }
};

const users: Route = {
  path: "/users",
  middleware: [jwtAuth],
  subRoutes: [
    {
      path: "/byId/:id",
      middleware: [addParams("id", "id")],
      GET: { callback: getUserById },
      PUT: {
        middleware: [userHasRole([UserRole.Cashier])],
        callback: changePassword
      },
      DELETE: {
        middleware: [userHasRole([UserRole.Cashier])],
        callback: deleteUser
      }
    },
    barmans,
    cashiers,
    cooks,
    waiters
  ],
  GET: { callback: getUsers },
  POST: { middleware: [userHasRole([UserRole.Cashier])], callback: createUser }
};

export function getUsers(req, res, next) {
  const filter = {};
  if (req.query.role) {
    filter["role"] = isUserRole(req.query.role) ? req.query.role : "";
  }
  UserModel.find(filter)
    .then(users => {
      return res.json(users);
    })
    .catch(err => {
      return next(err);
    });
}

function getUserById(req, res, next) {
  UserModel.findOne({ _id: req.urlParams.id })
    .then(user => {
      if (!user) {
        return res.status(404).json(error("User not found"));
      }
      return res.json(user);
    })
    .catch(err => {
      return next(err);
    });
}

function createUser(req, res, next) {
  if (!isCreateUserForm(req.body)) {
    return res.status(400).json(error("Bad request"));
  }

  let user: User;

  switch (req.body.role) {
    case UserRole.Barman:
      user = new BarmanModel(req.body);
      break;
    case UserRole.Cashier:
      user = new CashierModel(req.body);
      break;
    case UserRole.Cook:
      user = new CookModel(req.body);
      break;
    case UserRole.Waiter:
      user = new WaiterModel(req.body);
  }
  user.setPassword(req.body.password);
  user
    .save()
    .then(() => {
      return res.json(user);
    })
    .catch(err => {
      return next(err);
    });
}

function changePassword(req, res, next) {
  if (!isChangePasswordForm(req.body)) {
    return res.status(400).json(error("Bad request"));
  }

  UserModel.findById(req.urlParams.id)
    .then(user => {
      if (!user) {
        return res.status(404).json(error("User not found"));
      }
      user.setPassword(req.body.password);
      user
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

function deleteUser(req, res, next) {
  UserModel.findById(req.urlParams.id)
    .then(user => {
      if (!user) {
        return res.status(404).json(error("User not found"));
      }
      UserModel.deleteOne({ _id: req.urlParams.id })
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

export default users;
