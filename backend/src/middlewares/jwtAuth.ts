import jwt = require("express-jwt");

export default jwt({ secret: process.env.JWT_SECRET });
