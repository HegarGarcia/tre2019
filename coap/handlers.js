const sensors = [];
let temp = 36;
let isAlarmActivated = false;

function handleTemperature(res, params) {
  temp = params.query.temperature;
  console.log("Temperature updated...(%s)", temp);
  res.end();
}

function handleSprinkler(res) {
  res.end(JSON.stringify({ state: temp > 40 ? "on" : "off" }));
}

function registerSensor(res) {
  const id = `node${sensors.length}`;
  sensors.push(id);
  res.end(JSON.stringify({ id }));
  return id;
}

function handleRing(res, doorState) {
  res.end(JSON.stringify({ state: isAlarmActivated && !!doorState }));
}

function handleLock(res, params) {
  isAlarmActivated = !!+params.query.state;
  console.log("Alarm state...%s", isAlarmActivated ? "locked" : "unlocked");
  res.end();
}

module.exports = {
  handleSprinkler,
  handleTemperature,
  handleLock,
  handleRing,
  registerSensor
};
