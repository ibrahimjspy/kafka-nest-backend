import { mediaDto } from 'src/transformer/types/product';

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
  sourceMedia: mediaDto[],
  destinationMedia,
): mediaDto[] => {
  const transformedDestinationMedia = destinationMedia.map((media) => {
    return media.url.split('ColorSwatch/')[1];
  });
  const transformedSourceMedia = sourceMedia.map((image) => {
    return image.large.split('Pictures/')[0];
  });
  return transformedSourceMedia
    .filter((url) => !transformedDestinationMedia.includes(url))
    .map((url) => {
      return { large: url };
    });
};
