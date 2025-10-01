

# KafkaJS Producer-Consumer Example

This project demonstrates a simple **Kafka producer and consumer** using **KafkaJS** in Node.js. It includes setup instructions, producer and consumer scripts, and notes on using npm or Yarn.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Installing Dependencies](#installing-dependencies)
- [Producer](#producer)
- [Consumer](#consumer)
- [Running the Project](#running-the-project)
- [Notes & Warnings](#notes--warnings)
- [References](#references)

---

## Prerequisites
- Node.js installed (v14+ recommended)
- Kafka broker running locally (with ZooKeeper if using older Kafka versions)
- Optional: Docker for running Kafka and ZooKeeper

---

## Project Setup

1. Create project folder:

```bash
mkdir kafka-app
cd kafka-app
````

2. Initialize Node.js project (npm):

```bash
npm init -y
```

---

## Installing Dependencies

Install **KafkaJS**:

```bash
npm install kafkajs
```

> Alternatively, you can use Yarn:
>
> ```bash
> yarn add kafkajs
> ```

---

## Producer

`producer.js` sends messages to the Kafka topic.

```js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log("Producer Connected Successfully");

  await producer.send({
    topic: 'rider-updates',
    messages: [{ value: 'Hello KafkaJS!' }],
  });

  await producer.disconnect();
};

run().catch(console.error);
```

---

## Consumer

`consumer.js` receives messages from a Kafka topic.

```js
const { kafka } = require("./Client"); // make sure Client.js exports Kafka instance
const group = process.argv[2];

if (!group) {
  console.error("Please provide a group name as the first argument.");
  process.exit(1);
}

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`${group}: [${topic}] PART:${partition}:`, message.value.toString());
    },
  });
}

init().catch(console.error);
```

**Run consumer with group name:**

```bash
node consumer.js rider-group
```

---

## Running the Project

1. Make sure **Kafka broker** is running.
2. Start the consumer:

```bash
node consumer.js rider-group
```

3. Run the producer to send messages:

```bash
node producer.js
```

4. Observe messages printed by the consumer.

---

## Notes & Warnings

* Initial logs may show:

```
[Connection] Response GroupCoordinator ... The group coordinator is not available
```

This is normal when the consumer starts and will resolve automatically once the coordinator is available.

* KafkaJS v2.0+ shows a partitioner warning:

```
KafkaJS v2.0.0 switched default partitioner...
```

You can ignore it, or set legacy partitioner:

```js
const { Kafka, Partitioners } = require('kafkajs');
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
```

* Use **npm** or **Yarn** — both work. Yarn is optional.

---

## References

* [KafkaJS Official Docs](https://kafka.js.org/)
* [KafkaJS v2 Migration Guide](https://kafka.js.org/docs/migration-guide-v2.0.0)
* [Apache Kafka](https://kafka.apache.org/)

---

```

---

```
