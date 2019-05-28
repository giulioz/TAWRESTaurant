import socketioJwtAuth = require("socketio-jwt-auth");

export const ioJwtAuth = socketioJwtAuth.authenticate(
  {
    secret: process.env.JWT_SECRET
  },
  function(payload, done) {
    return done(null, payload);
  }
);
