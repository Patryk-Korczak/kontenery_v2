import {Kafka} from "kafkajs";
async function run() {
  // Create a new Kafka instance
  const kafka = new Kafka({
    clientId: 'device-mock-producer',
    brokers: ['localhost:9011'] // Use the external port mapped in your docker-compose
  });

  // Create a producer
  const producer = kafka.producer();

  // Connect the producer
  await producer.connect();

  // Send a message to a topic
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  });

  console.log('Message sent successfully');

  await producer.disconnect();
}

run().catch(console.error);
