export const createContext = (request, options) => ({
  request,
  url: new URL(request.url),
  response: {
    body: "",
    status: undefined,
    headers: new Headers(),
  },
  db: options.db,
  staticBase: options.staticBase,
  nunjucks: options.nunjucks,
});
