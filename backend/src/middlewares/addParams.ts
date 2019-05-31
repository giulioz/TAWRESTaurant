export function addParams(param: string, name?: string) {
  return function addParam(req, res, next) {
    if (!name) name = param;
    if (!req.urlParams) req.urlParams = {};
    req.urlParams[name] = req.params[param];
    next();
  };
}
