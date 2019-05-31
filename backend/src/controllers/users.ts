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

const router = express.Router();

router.use(jwtAuth);

router.get("/", getUsers);

router
  .route("/waiters")
  .get((req, res, next) => {
    req.query = { role: UserRole.Waiter };
    next();
  }, getUsers)
  .post(
    userHasRole([UserRole.Cashier]),
    (req, res, next) => {
      req.body.role = UserRole.Waiter;
      next();
    },
    createUser
  );

router.get("/waiters/byId/:id/tables", (req, res) => {
  let id = req.params.id;
  TableModel.find({ servedBy: id }).then(tables => {
    res.json(tables);
  });
});

router
  .route("/cooks")
  .get((req, res, next) => {
    req.query = { role: UserRole.Cook };
    next();
  }, getUsers)
  .post(
    userHasRole([UserRole.Cashier]),
    (req, res, next) => {
      req.body.role = UserRole.Cook;
      next();
    },
    createUser
  );

router.get("/cooks/byId/:id/orders", (req, res) => {
  let id = req.params.id;
  FoodOrderModel.find({ cook: id }).then(orders => {
    res.json(orders);
  });
});

router
  .route("/barmans")
  .get((req, res, next) => {
    req.query = { role: UserRole.Barman };
    next();
  }, getUsers)
  .post(
    userHasRole([UserRole.Cashier]),
    (req, res, next) => {
      req.body.role = UserRole.Barman;
      next();
    },
    createUser
  );

router.get("/barmans/byId/:id/orders", (req, res) => {
  let id = req.params.id;
  BeverageOrderModel.find({ barman: id }).then(orders => {
    res.json(orders);
  });
});

router
  .route("/cashiers")
  .get((req, res, next) => {
    req.query = { role: UserRole.Cashier };
    next();
  }, getUsers)
  .post(
    userHasRole([UserRole.Cashier]),
    (req, res, next) => {
      req.body.role = UserRole.Cashier;
      next();
    },
    createUser
  );

router.get("/byId/:id", getUserById);

router.put(
  "/byId/:id/password",
  userHasRole([UserRole.Cashier]),
  changePassword
);

router.delete("/byId/:id", userHasRole([UserRole.Cashier]), deleteUser);

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

export function getUserById(req, res, next) {
  UserModel.findOne({ _id: req.params.id })
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

export function createUser(req, res, next) {
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

export function changePassword(req, res, next) {
  if (!isChangePasswordForm(req.body)) {
    return res.status(400).json(error("Bad request"));
  }

  UserModel.findById(req.params.id)
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

export function deleteUser(req, res, next) {
  UserModel.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).json(error("User not found"));
      }
      UserModel.deleteOne({ _id: req.params.id })
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
