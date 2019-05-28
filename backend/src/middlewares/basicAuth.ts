import passport = require("passport");
import passportHTTP = require("passport-http");
import { error } from "../helpers/error";
import { UserModel } from "../models";

passport.use(
  new passportHTTP.BasicStrategy((username, password, done) => {
    UserModel.findOne({ username: username })
      .select("+digest +salt")
      .exec((err, user) => {
        if (err) {
          return done(error(err.message));
        }
        if (!user) {
          return done(error("Unknown username"));
        }
        if (user.validatePassword(password)) {
          return done(null, user);
        }
        return done(error("Invalid password"));
      });
  })
);

export const basicAuth = passport.authenticate("basic", { session: false });
