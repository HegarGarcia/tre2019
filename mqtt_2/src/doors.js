const mqtt = require('mqtt');
const inquire = require('inquirer');

(async () => {
  let client = {};
  const { amount } = await inquire.prompt([
    { name: 'amount', message: 'How many doors you have?' }
  ]);

  try {
    client = mqtt.connect('ws://test.mosquitto.org', {
      port: 8080,
      protocol: 'ws'
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }

  const doors = Array.from({ length: amount }, async (_, i) => {
    const door = `door${i}`;
    const time = 1000;
    console.log(`ID: ${door}`);

    return setInterval(
      () =>
        console.log(`Send to: ${door}`) ||
        client.publish(
          `tre2019/doors/${door}`,
          Math.round(Math.random()).toString()
        ),
      time
    );
  });
})();
