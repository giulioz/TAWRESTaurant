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
import { Route } from ".";
import { addParams } from "../middlewares/addParams";
import { setQueryRole, setBodyRole } from "../middlewares/setRole";

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
    middleware: [setQueryRole(UserRole.Barman)],
    callback: getUsers
  },
  POST: {
    middleware: [userHasRole([UserRole.Cashier]), setBodyRole(UserRole.Barman)],
    callback: postUser
  }
};

const cashiers: Route = {
  path: "/cashiers",
  GET: {
    middleware: [setQueryRole(UserRole.Cashier)],
    callback: getUsers
  },
  POST: {
    middleware: [
      userHasRole([UserRole.Cashier]),
      setBodyRole(UserRole.Cashier)
    ],
    callback: postUser
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
    middleware: [setQueryRole(UserRole.Cook)],
    callback: getUsers
  },
  POST: {
    middleware: [userHasRole([UserRole.Cashier]), setBodyRole(UserRole.Cook)],
    callback: postUser
  }
};

const waiters: Route = {
  path: "/waiters",
  subRoutes: [
    {
      path: "/byId/:id/tables",
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
    middleware: [setQueryRole(UserRole.Waiter)],
    callback: getUsers
  },
  POST: {
    middleware: [userHasRole([UserRole.Cashier]), setBodyRole(UserRole.Waiter)],
    callback: postUser
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
        callback: putChangePassword
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
  POST: { middleware: [userHasRole([UserRole.Cashier])], callback: postUser }
};

function getUsers(req, res, next) {
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

function postUser(req, res, next) {
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

function putChangePassword(req, res, next) {
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
