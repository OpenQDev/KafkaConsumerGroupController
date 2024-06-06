import { Kafka } from 'kafkajs';
import consumerCheck from './consumerCheck';
import { 	FIRST_CONSUMER_GROUP_ID,
	SECOND_CONSUMER_GROUP_ID,
	FIRST_CONSUMER_GROUP_CONSUMER_COUNT,
	SECOND_CONSUMER_GROUP_CONSUMER_COUNT, 
	FIRST_TOPIC,
	SECOND_TOPIC} from './constants';
import { messageProcessor } from './messageProcessor';
import { spawnConsumer } from './spawnConsumer';
import { produceMessages } from './produceMessages';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const consumerSpawners = {
	[FIRST_CONSUMER_GROUP_ID]: () => spawnConsumer(
		kafka,
		messageProcessor,
		FIRST_CONSUMER_GROUP_ID,
		FIRST_TOPIC
	),
	[SECOND_CONSUMER_GROUP_ID]: () => spawnConsumer(
		kafka,
		messageProcessor,
		SECOND_CONSUMER_GROUP_ID,
		SECOND_TOPIC
	),
};

void consumerCheck(kafka, consumerSpawners)

for (
	let i = 0;
	i < FIRST_CONSUMER_GROUP_CONSUMER_COUNT;
	i++
) {
	spawnConsumer(kafka, messageProcessor, FIRST_CONSUMER_GROUP_ID, FIRST_TOPIC)
}

for (
	let i = 0;
	i < SECOND_CONSUMER_GROUP_CONSUMER_COUNT;
	i++
) {
	spawnConsumer(kafka, messageProcessor, SECOND_CONSUMER_GROUP_ID, SECOND_TOPIC)
}

const producer = kafka.producer();
produceMessages(producer);
