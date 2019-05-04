const coap = require("coap");
const url = require("url");
const {
  handleLock,
  handleTemperature,
  handleRing,
  handleSprinkler,
  registerSensor
} = require("./handlers");

const server = coap.createServer();

server.on("request", (req, res) => {
  const parsedURL = url.parse(req.url, true);
  switch (parsedURL.pathname) {
    case "/sensors/register":
      const id = registerSensor(res);
      console.log("Node %s registered", id);
      break;
    case "/sensors/node0/setAlarm":
      handleLock(res, parsedURL);
      break;
    case "/sensors/node0/ring":
      const doorState = parsedURL.query.door;
      handleRing(res, doorState);
      break;
    case "/sensors/node1/sprinkler":
      handleSprinkler(res);
      break;
    case "/sensors/node1/temperature":
      handleTemperature(res, parsedURL);
      break;
    default:
      res.end();
      break;
  }
});

server.listen(() => console.log("Server is listening"));
