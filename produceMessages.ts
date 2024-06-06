import { Producer } from "kafkajs";
import { FIRST_TOPIC, SECOND_TOPIC } from "./constants";
import { randomId } from "./randomId";

export const produceMessages = async (producer: Producer) => {
  await producer.connect();
  
	setInterval(async () => {
    try {
      await producer.send({
        topic: FIRST_TOPIC,
        messages: [
          { value: JSON.stringify({ objectId: randomId() }) },
        ],
      });

      await producer.send({
        topic: SECOND_TOPIC,
        messages: [
          { value: JSON.stringify({ objectId: randomId() }) },
        ],
      });
    } catch (err) {
      console.error('Error producing messages', err);
    }
  }, 3000);
};