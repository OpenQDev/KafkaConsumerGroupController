import { Kafka } from "kafkajs";
import { 
	CONSUMER_CHECK_INTERVAL,
	FIRST_CONSUMER_GROUP_ID,
	SECOND_CONSUMER_GROUP_ID,
	FIRST_CONSUMER_GROUP_CONSUMER_COUNT,
	SECOND_CONSUMER_GROUP_CONSUMER_COUNT
} from "./constants";

const consumerCheck = async (
  kafka: Kafka,
  consumerSpawner: Record<string, (kafka: Kafka) => Promise<void>>
) => {
  const admin = kafka.admin();

  const consumerGroups = [
    {
      groupId: FIRST_CONSUMER_GROUP_ID,
      desiredNumberOfConsumers: FIRST_CONSUMER_GROUP_CONSUMER_COUNT,
      spawnConsumer:
        consumerSpawner[FIRST_CONSUMER_GROUP_ID],
    },
    {
      groupId: SECOND_CONSUMER_GROUP_ID,
      desiredNumberOfConsumers: SECOND_CONSUMER_GROUP_CONSUMER_COUNT,
      spawnConsumer:
        consumerSpawner[SECOND_CONSUMER_GROUP_ID],
    },
  ];

  setInterval(async () => {
    try {
      console.log("=======");
      for (const consumerGroup of consumerGroups) {
        const { groups } = await admin.describeGroups([consumerGroup.groupId]);
        const groupInfo = groups.find(
          (group) => group.groupId === consumerGroup.groupId
        );

        console.log(
          `${consumerGroup.groupId} | ${groupInfo?.members.length} / ${consumerGroup.desiredNumberOfConsumers} members | ${groupInfo?.state}.`
        );

        if (
          groupInfo?.state == "Stable" &&
          groupInfo?.members.length < consumerGroup.desiredNumberOfConsumers
        ) {
          const consumerDiff =
            consumerGroup.desiredNumberOfConsumers - groupInfo!.members.length;

          console.log(
            `spawning ${consumerDiff} new ${consumerGroup.groupId} consumers...`
          );

          for (let i = 0; i < consumerDiff; i++) {
            consumerGroup.spawnConsumer(kafka).catch((err) => {
              console.error(err, "uncaught kafka error");
            });
          }
        }
      }
      console.log("=======");
    } catch (e) {
      console.error(`Kafka Admin error: ${e}`);
    }
  }, CONSUMER_CHECK_INTERVAL);
};

export default consumerCheck;
