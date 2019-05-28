import express = require("express");
import { jwtAuth } from "../middlewares/jwtAuth";
import { userHasRole } from "../middlewares/userHasRole";
import { error } from "../helpers/error";
import { UserRole } from "../models/user";

const router = express.Router();

router.use(jwtAuth);

router.get("/", getOrders);

router.get("/:ido", getOrderById);

router.post("/", userHasRole([UserRole.Cashier]), createOrder);

router.put(
  "/:ido",
  userHasRole([UserRole.Cashier, UserRole.Waiter]),
  changeStatus
);

router.delete("/:ido", userHasRole([UserRole.Cashier]), deleteOrder);

function getOrders(req, res, next) {}

function getOrderById(req, res, next) {}

function createOrder(req, res, next) {}

function changeStatus(req, res, next) {}

function deleteOrder(req, res, next) {}

export default router;
