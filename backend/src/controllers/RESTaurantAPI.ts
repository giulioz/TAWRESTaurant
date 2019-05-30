import { getUsers, getUserById, changePassword, createUser } from "./users";
import { userHasRole } from "../middlewares/userHasRole";
import { UserRole } from "../models/user";

type METHOD = {
  guard?: [Function];
  use: Function;
};

type Endpoint = {
  route: String;
  middleware?: [Function];
  endpoints?: [Endpoint];
  GET?: METHOD;
  POST?: METHOD;
  PUT?: METHOD;
  DELETE?: METHOD;
};

const exampleUsers: Endpoint = {
  route: "/users",
  endpoints: [
    {
      route: "/byId:id",
      GET: { use: getUserById },
      PUT: { guard: [userHasRole([UserRole.Cashier])], use: changePassword },
      DELETE: { guard: [userHasRole([UserRole.Cashier])], use: getUserById }
    }
  ],
  GET: { guard: null, use: getUsers },
  POST: { guard: [userHasRole([UserRole.Cashier])], use: createUser }
};

export const endpoints = {
  "/": {
    GET: { res: "endpoints" }
  },
  "/users": {
    "/": {
      GET: { guard: ["middleware"], use: getUsers }
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
          "{status: seats, tableStatus, foodOrdersStatus, beverageOrdersStatus}",
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

const util = require("util");
console.log("endpoints:\n", util.inspect(endpoints, false, null, true));
