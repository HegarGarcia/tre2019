const sendResquest = require("./sendRequest");
const _ = require("lodash");
let id = "node0";
const basePath = `/sensors/${id}`;

let isDoorOpen = 0;
let isAlarmSet = 0;

setInterval(() => {
  isDoorOpen = _.random(0, 1);
  isAlarmSet = _.random(0, 1);

  sendResquest(`${basePath}/setAlarm`, "POST", () => {}, `state=${isAlarmSet}`);

  console.log("Door is...%s", Boolean(isDoorOpen) ? "OPEN" : "CLOSED");

  sendResquest(
    `${basePath}/ring`,
    "GET",
    res => {
      const { state } = JSON.parse(res.payload.toString());
      if (state) {
        console.log("Alarm is ringing...");
      }
    },
    `door=${isDoorOpen}`
  );
}, 2000);
