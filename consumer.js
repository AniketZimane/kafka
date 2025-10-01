const { kafka } = require("./Client"); // make sure Client.js exports Kafka instance correctly
const group = process.argv[2];

if (!group) {
  console.error("Please provide a group name as the first argument.");
  process.exit(1);
}

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  // Corrected: topic instead of topics
  await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`${group}: [${topic}] PART:${partition}:`, message.value.toString());
    },
  });
}

init().catch(console.error);
