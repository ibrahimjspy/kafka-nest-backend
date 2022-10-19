export const productMediaTransformerMethod = async (
  mediaObject,
): Promise<string[]> => {
  let media = [];
  if (mediaObject) {
    media = [...mediaObject.medium, ...mediaObject.tiny, ...mediaObject.large];
  }
  return media;
};
