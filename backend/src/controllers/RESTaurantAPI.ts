const express = require("express");
import {
  getUsers,
  getUserById,
  changePassword,
  createUser,
  deleteUser
} from "./users";
import { userHasRole } from "../middlewares/userHasRole";
import { UserRole } from "../models/user";
import { jwtAuth } from "../middlewares/jwtAuth";
import { BeverageOrderModel, FoodOrderModel, TableModel } from "../models";
import { addParams } from "../middlewares/addParams";
import { basicAuth } from "../middlewares/basicAuth";
import { login } from "./login";

export type METHOD = {
  guards?: [Function];
  callback: Function;
};

export type Endpoint = {
  route: String;
  middlewares?: Array<Function>;
  endpoints?: Array<Endpoint>;
  GET?: METHOD;
  POST?: METHOD;
  PUT?: METHOD;
  DELETE?: METHOD;
};

function createGuard(guards: Array<Function>) {
  if (!guards || guards.length === 0)
    return (req, res, next) => {
      next();
    };
  return (req, res, next) => {
    if (
      guards.every((guard: Function) => {
        return guard(req, res);
      })
    )
      next();
  };
}

export function createRouter(endpoint: Endpoint) {
  const { route, middlewares, endpoints, GET, POST, PUT, DELETE } = endpoint;
  let router = express.Router();
  if (middlewares)
    middlewares.forEach((middleware: Function) => {
      router.use(route, middleware);
    });
  if (GET) router.get(route, createGuard(GET.guards), GET.callback);
  if (POST) router.post(route, createGuard(POST.guards), POST.callback);
  if (PUT) router.put(route, createGuard(PUT.guards), PUT.callback);
  if (DELETE) router.delete(route, createGuard(DELETE.guards), DELETE.callback);
  if (endpoints)
    endpoints.forEach((endpoint: Endpoint) => {
      router.use(route, createRouter(endpoint));
    });
  return router;
}

const barmans: Endpoint = {
  route: "/barmans",
  middlewares: [
    (req, res, next) => {
      req.query.role = UserRole.Barman;
      next();
    },
    addParams("id", "id")
  ],
  endpoints: [
    {
      route: "/byId/:id/orders",
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
  GET: { callback: getUsers }
};

const cashiers: Endpoint = {
  route: "/cashiers",
  middlewares: [
    (req, res, next) => {
      req.query.role = UserRole.Cashier;
      next();
    }
  ],
  GET: { callback: getUsers }
};

const cooks: Endpoint = {
  route: "/cooks",
  middlewares: [
    (req, res, next) => {
      req.query.role = UserRole.Cook;
      next();
    },
    addParams("id", "id")
  ],
  endpoints: [
    {
      route: "/byId/:id/orders",
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
  GET: { callback: getUsers }
};

const waiters: Endpoint = {
  route: "/waiters",
  middlewares: [
    (req, res, next) => {
      req.query.role = UserRole.Waiter;
      next();
    },
    addParams("id", "id")
  ],
  endpoints: [
    {
      route: "/byId/:id/orders",
      GET: {
        callback: (req, res) => {
          let id = req.urlParams.id;
          TableModel.find({ servedBy: id }).then(tables => {
            res.json(tables);
          });
        }
      }
    }
  ],
  GET: { callback: getUsers }
};

const users: Endpoint = {
  route: "/users",
  middlewares: [jwtAuth],
  endpoints: [
    {
      route: "/byId/:id",
      GET: { callback: getUserById },
      PUT: {
        guards: [(req, res) => req.user.role === UserRole.Cashier],
        callback: changePassword
      },
      DELETE: {
        guards: [(req, res) => req.user.role === UserRole.Cashier],
        callback: deleteUser
      }
    },
    barmans,
    cashiers,
    cooks,
    waiters
  ],
  GET: { callback: getUsers },
  POST: { guards: [userHasRole([UserRole.Cashier])], callback: createUser }
};

const apiv1: Endpoint = {
  route: "/api/v1",
  endpoints: [login, users],
  GET: {
    callback: (req, res) => {
      res.send("API V1");
    }
  }
};

export const root: Endpoint = {
  route: "/",
  endpoints: [apiv1],
  GET: {
    callback: (req, res) => {
      res.send("root");
    }
  }
};

export const endpoints = {
  "/": {
    GET: { res: "endpoints" }
  },
  "/users": {
    "/": {
      GET: { guard: ["middleware"], callback: getUsers }
    },
    "/byId/:id": {
      "/": {
        GET: { res: "User" },
        DELETE: { res: "nothing" }
      },
      "/password": {
        PUT: { body: "{password}", res: "User" }
      }
    },
    "/barmans": {
      "/": {
        GET: { res: "Array<Barman>" },
        POST: { body: "{username, name, surname, password}", res: "Barman" }
      },
      "/byId/:id/orders": {
        GET: { res: "Array<BeverageOrder>" }
      }
    },
    "/cashiers": {
      "/": {
        GET: { res: "Array<Cashier>" },
        POST: { body: "{username, name, surname, password}", res: "Cashier" }
      }
    },
    "/cooks": {
      "/": {
        GET: { res: "Array<Cook>" },
        POST: { body: "{username, name, surname, password}", res: "Cook" }
      },
      "/byId/:id/orders": {
        GET: { res: "Array<FoodOrder>" }
      }
    },
    "/waiters": {
      "/": {
        GET: { res: "Array<Waiter>" },
        POST: { body: "{username, name, surname, password}", res: "Waiter" }
      },
      "/byId/:id/tables": {
        GET: { res: "Array<Table>" }
      }
    }
  },
  "/menu": {
    "/": {
      GET: { res: "Array<MenuItem>" }
    },
    "/byId/:id": {
      GET: { res: "MenuItem" }
    },
    "/foods": {
      GET: { res: "Array<Food>" }
    },
    "/beverages": {
      GET: { res: "Array<Beverage>" }
    }
  },
  "/tables": {
    "/": {
      GET: {
        query:
          "{status, seats, tableStatus, foodOrdersStatus, beverageOrdersStatus}",
        res: "Array<Table>"
      }
    },
    "/byId/:id": {
      "/": {
        GET: { res: "Table" },
        PUT: { action: '"occupy" | "free"', res: "Table" }
      },
      "/orders": {
        "/": {
          GET: { query: "{status}", res: "Array<Order>" },
          PUT: { action: '"commit"' }
        },
        "/byId/:id": {
          GET: { res: "Order" },
          PUT: { action: '"assign" | "notify"', res: "Order" },
          DELETE: { res: "nothing" }
        },
        "/foodOrders": {
          GET: { query: "{status}", res: " Array<FoodOrder>" },
          POST: { body: "{food}", res: "FoodOrder" }
        },
        "/beverageOrders": {
          GET: { query: "{status}", res: "Array<BeverageOrder>" },
          POST: { body: "{beverage}", res: "BeverageOrder" }
        }
      }
    }
  }
};

/*
const util = require("util");
console.log("endpoints:\n", util.inspect(endpoints, false, null, true));
*/
