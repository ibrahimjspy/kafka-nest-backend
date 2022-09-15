export const seoMessageStream = async (kafkaMessage) => {
  const streamedMessage = kafkaMessage;
  streamedMessage.variant_id = await getVariantId();
  return streamedMessage;
};

const getVariantId = () => {
  return 'Q2F0ZWdvcnk6Mg==';
};
