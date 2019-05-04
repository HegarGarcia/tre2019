const { flattenDeep, reduce, groupBy } = require('lodash');
const mqtt = require('mqtt');
const inquire = require('inquirer');

const client = mqtt.connect('mqtt://test.mosquitto.org', {port: 8080});

(async () => {
  const { amount } = await inquire.prompt([
    { name: 'amount', message: 'How many doors you have?' }
  ]);

  const doorQuestions = flattenDeep(
    Array.from({ length: amount }, (_, i) => [
      {
        name: `id${i}`,
        message: `ID of the door ${i}: `
      },
      {
        name: `open${i}`,
        message: 'Should it be open?',
        type: 'confirm'
      }
    ])
  );

  const doorsResponse = await inquire.prompt(doorQuestions);
  const { string: ids, boolean: areOpen } = groupBy(
    doorsResponse,
    resp => typeof resp
  );

  ids.forEach(doorId => client.subscribe(`tre2019/doors/${doorId}`));

  client.on('message', (topic, message) => {
    const id = topic.substring(14);
    const shouldBeOpen = areOpen[ids.indexOf(id)];
    const isOpen = Boolean(+message.toString());

    if (shouldBeOpen !== isOpen) {
      console.log(`${id} - ${message.toString()} - ${shouldBeOpen}`);
    }
  });
})();
