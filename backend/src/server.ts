import * as express from "express";
import * as http from "http";
import * as socket from "socket.io";

export const app = express();
export const server = new http.Server(app);
export const io = socket(server, { path: "/api/v1/events" });
