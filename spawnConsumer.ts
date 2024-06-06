import { Kafka } from "kafkajs";

export async function spawnConsumer(
  kafka: Kafka,
  messageProcessor: (kafkaMessage) => void,
  groupId: string,
  topic: string
) {
  const consumer = kafka.consumer({
    groupId: groupId,
  });

  try {
    consumer.on(consumer.events.DISCONNECT, (event) => {
      console.error(
        `${topic} Consumer disconnected: ${JSON.stringify(event)}`
      );
    });

    consumer.on(consumer.events.CRASH, async (event) => {
      console.error(
        `${topic} Consumer crashed: ${JSON.stringify(event)}`
      );
    });

    consumer.on(consumer.events.STOP, (event) => {
      console.error(
        `${topic} Consumer stopped: ${JSON.stringify(event)}`
      );
    });

    await consumer.connect();
    await consumer.subscribe({ topic });

    await consumer.run({
      partitionsConsumedConcurrently: 1,
      autoCommit: false,
      eachMessage: async ({ message, partition }) => {
        const kafkaMessage = JSON.parse(
          message.value!.toString()
        );

        const { objectId } = kafkaMessage;

        console.log(
          `MESSAGE ${partition}:${message.offset} RECEIVED!`
        );

        console.log({
          partition: partition,
          offset: message.offset,
          objectId,
        });

				messageProcessor(kafkaMessage)

        try {
          await consumer.commitOffsets([
            {
              topic: topic,
              partition: partition,
              offset: message.offset,
            },
          ]);
          console.log(
            `OFFSET ${partition}:${message.offset} committed`
          );
        } catch (error) {
          console.error(
            `Error committing offset for ${objectId}: ${error}`
          );
        }
      },
    });
  } catch (error) {
    console.error(`Error running evaluations consumer: ${error}`);
  }
}
