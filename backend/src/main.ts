require("./config");
import mongoose = require("mongoose");
import express = require("express");
import bodyParser = require("body-parser");
import { app, server, io } from "./server";
import { ioJwtAuth } from "./middlewares/ioJwtAuth";
import { error } from "./helpers/error";
import { createRouter, root } from "./controllers";

(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
  });
  console.log("Connected to MongoDB");

  app.use("/static", express.static("public"));

  app.use(bodyParser.json());

  app.use(createRouter(root));

  // Error handling middleware
  app.use((err, req, res, next) => {
    return res.status(err.status || 500).json(error(err.message));
  });

  app.use((req, res, next) => {
    return res.status(404).json(error("Invalid endpoint"));
  });

  io.use(ioJwtAuth);

  // DEBUG
  io.on("connection", socket => {
    socket.emit("greeting", { user: socket.request.user });
  });

  server.listen(parseInt(process.env.SERVER_PORT), () => {
    console.log("Listening on port " + process.env.SERVER_PORT);
  });
})();
