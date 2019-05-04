const sendResquest = require("./sendRequest");
let id = "node1";
const basePath = `/sensors/${id}`;
// sendResquest("/sensors/register", "POST", res => {
//   const payload = JSON.parse(res.payload.toString());
//   id = payload.id;
// });

setInterval(() => {
  sendResquest(
    `${basePath}/temperature`,
    "POST",
    () => {},
    `temperature=${Math.floor(Math.random() * 50) + 20}`
  );

  sendResquest(`${basePath}/sprinkler`, "GET", res => {
    const { state } = JSON.parse(res.payload.toString());
    console.log("Updateing sprinkler state...%s", state.toUpperCase());
  });
}, 2000);
