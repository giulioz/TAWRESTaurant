import express = require("express");
import jsonwebtoken = require("jsonwebtoken");
import basicAuth from "../middlewares/basicAuth";

const router = express.Router();

router.post("/", basicAuth, signToken);

function signToken(req, res) {
  const tokenData = {
    username: req.user.username,
    name: req.user.name,
    surname: req.user.surname,
    role: req.user.role
  };

  const token = jsonwebtoken.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  return res.status(200).json({ token: token });
}

export default router;
