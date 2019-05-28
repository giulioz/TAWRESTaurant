export const app = require("express")();

export const server = require("http").Server(app);

export const io = require("socket.io")(server, { path: "/api/v1/events" });
