import express = require("express");
import jsonwebtoken = require("jsonwebtoken");
import { basicAuth } from "../middlewares/basicAuth";
import { Route } from "./RESTaurantAPI";

const router = express.Router();

router.post("/", basicAuth, signToken);

function signToken(req, res) {
  const data = {
    _id: req.user._id,
    username: req.user.username,
    name: req.user.name,
    surname: req.user.surname,
    role: req.user.role
  };

  const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, {
    expiresIn: "12h"
  });

  return res.json({ token: token });
}

export default router;

export const login: Route = {
  path: "/login",
  POST: { middleware: [basicAuth], callback: signToken }
};
