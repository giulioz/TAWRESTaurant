import { UserRole } from "../models/user";

export function setQueryRole(userRole: UserRole) {
  return (req, res, next) => {
    req.query.role = userRole;
    next();
  };
}

export function setBodyRole(userRole: UserRole) {
  return (req, res, next) => {
    req.body.role = userRole;
    next();
  };
}
