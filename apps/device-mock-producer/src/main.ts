import {Kafka} from "kafkajs";
async function run() {
  // Create a new Kafka instance
  const kafka = new Kafka({
    clientId: 'device-mock-producer',
    brokers: ['192.168.0.57:9011'] // Use the external port mapped in your docker-compose
  });

  // Create a producer
  const producer = kafka.producer();

  // Connect the producer
  await producer.connect();

  // Send a message to a topic
  if (Math.random() < 0.3) {
    await producer.send({
      topic: 'data.event',
      messages: [
        {
          value: JSON.stringify({
            payload: -1,
            deviceId: `dev--device__${(Math.random()*10).toFixed(0)}`,
            timestamp: new Date().toUTCString()
          })
        },
      ],
    });
  } else if (Math.random() < 0.3) {
    await producer.send({
      topic: 'data.event',
      messages: [
        {
          value: JSON.stringify({
            payload: -1,
            deviceId: null,
            timestamp: new Date().toUTCString()
          })
        },
      ],
    });
  }else {
    await producer.send({
      topic: 'data.event',
      messages: [
        {
          value: JSON.stringify({
            payload: +(Math.random()*100).toFixed(2),
            deviceId: `dev--device__${(Math.random()*10).toFixed(0)}`,
            timestamp: new Date().toUTCString()

          })
        },
      ],
    });
  }

  console.log('Message sent successfully');

  await producer.disconnect();
}

run().catch(console.error);
