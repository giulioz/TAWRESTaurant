require("./config");

import mongoose = require("mongoose");

import express = require("express");
import bodyParser = require("body-parser");

import apiRouter from "./controllers";

(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
  });
  console.log("MongoDB connection is open");

  const app = express();

  app.use(bodyParser.json());

  app.use("/api/v1", apiRouter);

  // Error handling middleware
  app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({ error: true, message: err.message });
  });

  app.use((req, res, next) => {
    return res.status(404).json({ error: true, message: "Invalid endpoint" });
  });

  app.listen(parseInt(process.env.SERVER_PORT), () => {
    console.log("Listening on port " + process.env.SERVER_PORT);
  });
})();
