/**
 * media object transformed to a mappable array from object
 * @params object to be transformed and mapped
 * @returns media composite array
 */
export const productMediaTransformerMethod = async (
  mediaObject,
): Promise<string[]> => {
  let media = [];
  if (mediaObject) {
    media = [...mediaObject.medium, ...mediaObject.tiny, ...mediaObject.large];
  }
  return media;
};
