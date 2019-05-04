const coap = require("coap");

function sendResquest(pathname, method, callback, query = "") {
  return coap
    .request({
      hostname: "localhost",
      pathname,
      method,
      query
    })
    .on("response", callback)
    .end();
}

module.exports = sendResquest;
