// convert array into smaller chunks  [ab, bc, cd] =>  [[ab,bc],[cd]]
export const chunkArray = (arr, size) =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];

/**
 *  maps source and destination media to detect new media that needs to be inserted in destination
 * @params source media array
 * @params destination media array
 * @returns array containing urls not found in destination
 */
export const mediaUrlMapping = (
  sourceMedia: string[],
  destinationMedia,
): string[] => {
  const transformedDestinationMedia = destinationMedia.map((media) => {
    return media.url.split('media/')[0];
  });
  const transformedSourceMedia = sourceMedia.map((url) => {
    return url.split('Pictures/')[0];
  });
  return transformedSourceMedia.filter(
    (url) => !transformedDestinationMedia.includes(url),
  );
};
