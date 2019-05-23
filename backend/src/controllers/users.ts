import express = require("express");
import jwtAuth from "../middlewares/jwtAuth";
import { UserModel } from "../models";

const router = express.Router();

router.use(jwtAuth);

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

function getUsers(req, res) {
  UserModel.find(
    {
      /* TODO: filter by role */
    },
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: true, message: err.message });
      }
      return res.status(200).json(users);
    }
  );
}

function getUserById(req, res) {
  UserModel.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: true, message: err.message });
    }
    return res.status(200).json(user);
  });
}

function createUser(req, res) {
  if (req.user.role !== "Casher") {
    return res.status(403).json({ error: true, message: "Unauthorized" });
  }

  // TODO
}

function updateUser(req, res) {
  if (req.user.role !== "Casher") {
    return res.status(403).json({ error: true, message: "Unauthorized" });
  }

  // TODO
}

function deleteUser(req, res) {
  if (req.user.role !== "Casher") {
    return res.status(403).json({ error: true, message: "Unauthorized" });
  }

  // TODO
}

export default router;
