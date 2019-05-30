export function addParams(param: string, name: string) {
  return function addParam(req, res, next) {
    req.urlParams = {};
    req.urlParams[name] = req.params[param];
    console.log(param, name, req.urlParams[name]);
    next();
  };
}
