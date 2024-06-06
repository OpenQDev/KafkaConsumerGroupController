# KafkaConsumerGroupController

A method for using Kafka Admin to set up a control loop to keep consumer groups full.

## RUNNING

### Boot Kafka

I've graciously included the kafka binaries in the `kafka` directory

#### Boot Zookeeper in one terminal

```bash
cd kafka
bin/zookeeper-server-start.sh config/zookeeper.properties
```

#### Boot Kafka Broker in another terminal

```bash
cd kafka
bin/kafka-server-start.sh config/server.properties
```

### Boot the Node project

`yarn start`