import express = require("express");
import loginRouter from "./login";
import usersRouter from "./users";
// import menuRouter from "./menu";
// import tablesRouter from "./tables";

const routes = [
  {
    path: "/login",
    router: loginRouter,
    enabled: true
  },
  {
    path: "/users",
    router: usersRouter,
    enabled: true
  },
  {
    path: "/menu",
    router: null // menuRouter
  },
  {
    path: "/tables",
    router: null // tablesRouter
  }
];

const router = express.Router();

routes.forEach(route => {
  if (route.enabled) {
    router.use(route.path, route.router);
  }
});

router.get("/", (req, res, next) => {
  return res.json({
    name: "TAWRESTaurant API",
    version: "1.0.0",
    routes: routes.filter(({ enabled }) => enabled).map(({ path }) => path)
  });
});

export default router;
