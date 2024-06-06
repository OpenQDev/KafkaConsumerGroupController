export const messageProcessor = (kafkaMessage) => {
	console.log(`PROCESSING ${kafkaMessage.objectId}`)
}