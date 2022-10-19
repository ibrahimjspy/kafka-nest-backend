/**
 * media object transformed to a mappable array from object
 * @params object to be transformed and mapped
 * @returns media composite array
 */
export const productMediaTransformerMethod = async (
  mediaObject,
): Promise<string[]> => {
  const { medium, tiny, large } = mediaObject;
  let media = [];
  if (medium && tiny && large) {
    media = [...medium, ...tiny, ...large];
  }
  return media;
};
