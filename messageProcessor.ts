export const messageProcessor = (kafkaMessage: any) => {
	console.log(`PROCESSING ${kafkaMessage.objectId}`)
}