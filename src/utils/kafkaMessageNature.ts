/**
 * returns whether cdc change is update, delete or create
 * @params cdc debezium response parsed
 */
export const kafkaMessageCheck = async (
  kafkaMessage,
  sourceId,
  fetchDestinationId,
) => {
  if (kafkaMessage.op == 'c') {
    return 'create';
  }
  if (kafkaMessage.op == 'u') {
    const destinationId = await fetchDestinationId(sourceId);
    if (!destinationId) {
      return 'create';
    }
    return 'update';
  }
  if (kafkaMessage.op == 'd') {
    const destinationId = await fetchDestinationId(sourceId);
    if (!destinationId) {
      return;
    }
    return 'delete';
  }
};
