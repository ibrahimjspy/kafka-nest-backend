export const kafkaMessageCheck = (kafkaMessage): string => {
  if (kafkaMessage.op == 'u') {
    return 'update';
  }
  if (kafkaMessage.op == 'c') {
    return 'create';
  }
  return 'delete';
};
