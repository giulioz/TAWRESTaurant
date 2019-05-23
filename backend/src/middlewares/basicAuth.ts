import passport = require("passport");
import passportHTTP = require("passport-http");
import { UserModel } from "../models";

passport.use(
  new passportHTTP.BasicStrategy((username, password, done) => {
    UserModel.findOne({ username: username })
      .select("digest salt")
      .exec((err, user) => {
        if (err) {
          return done({ error: true, message: err });
        }
        if (!user) {
          return done({
            error: true,
            message: "Unknown username"
          });
        }
        if (user.validatePassword(password)) {
          return done(null, user);
        }
        return done({
          error: true,
          message: "Invalid password"
        });
      });
  })
);

export default passport.authenticate("basic", { session: false });
