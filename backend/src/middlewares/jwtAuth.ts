import jwt = require("express-jwt");

export const jwtAuth = jwt({ secret: process.env.JWT_SECRET });
