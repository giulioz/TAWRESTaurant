import { UserRole } from "../models/user";
import { error } from "../helpers/error";

export function userHasRole(allowedRoles: UserRole[]) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json(error("Authenticate first"));
    }
    if (allowedRoles.some(role => req.user.role === role)) {
      next();
    } else {
      return res
        .status(403)
        .json(
          error(
            "Unauthorized, you must have one of the following roles: " +
              allowedRoles.join(", ")
          )
        );
    }
  };
}
