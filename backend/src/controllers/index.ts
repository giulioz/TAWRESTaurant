import express = require("express");
import loginRouter from "./login";
import usersRouter from "./users";

const router = express.Router();

router.use("/login", loginRouter);

router.use("/users", usersRouter);

export default router;
