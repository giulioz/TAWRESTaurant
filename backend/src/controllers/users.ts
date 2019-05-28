import express = require("express");
import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { error } from "../helpers/error";
import {
  UserModel,
  WaiterModel,
  CookModel,
  BarmanModel,
  CashierModel
} from "../models";
import { UserRole, isUserRole, User } from "../models/user";
import { isCreateUserForm, isChangePasswordForm } from "../models/forms/user";

const router = express.Router();

router.use(jwtAuth);

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post("/", userHasRole([UserRole.Cashier]), createUser);

router.put("/:id/password", userHasRole([UserRole.Cashier]), changePassword);

router.delete("/:id", userHasRole([UserRole.Cashier]), deleteUser);

function getUsers(req, res, next) {
  const filter = {};
  if (req.query.username) {
    filter["username"] = { $regex: `.*${req.query.username.trim()}.*` };
  }
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

  UserModel.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).json(error("User not found"));
      }
      user.setPassword(req.body.password);
      user
        .save()
        .then(() => {
          return res;
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
