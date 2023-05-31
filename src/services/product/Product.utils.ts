import { shoeSizeMapping } from 'src/transformer/product/Product.transformer.utils';
import { mediaDto } from 'src/transformer/types/product';

/**
 *  this utility function converts an array of n size in k quantity by making their sub arrays like this 
 *    @example ['test', 'test1'],['test2', 'test3']]
      @links bundle service 
      @usecase splitting variants into quantities of colors , so we can create bundle against each color with equal amount
 */
export const chunkArray = (arr: string[], size: number) =>
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
  const transformedDestinationMedia = (destinationMedia || []).map((media) => {
    return media.url.split('media/')[1];
  });
  const transformedSourceMedia = (sourceMedia || []).map((image) => {
    return image.large.split('Pictures/')[0];
  });
  return transformedSourceMedia
    .filter((url) => !transformedDestinationMedia.includes(url))
    .map((url) => {
      return { large: url };
    });
};

/**
 * Generates bundles of shoe variants based on bundle sizes and shoe variants.
 * @param shoeVariants - The shoe variants object.
 * @param bundleSizes - The bundle sizes object.
 * @param length - The length of the bundles.
 * @returns A 2D array containing the shoe variants grouped into bundles.
 */
export const getShoeBundlesBySizes = (shoeVariants, bundleSizes, length) => {
  try {
    const matchingVariants = Object.keys(bundleSizes).map(
      (key) => shoeVariants[key],
    );
    const bundles = Array.from({ length }, () => []);

    matchingVariants.forEach((bundle) => {
      bundle.forEach((variant, key) => {
        bundles[key].push(variant);
      });
    });

    return bundles;
  } catch (error) {
    console.log(error);
    console.log({ shoeVariants, bundleSizes, length }, '---error---');
  }
};

/**
 * Returns shoe sizes based on the provided shoe sizes mapping.
 * @param shoeSizes - The shoe sizes mapping object.
 * @returns An array of shoe sizes.
 */
export const getShoeSizes = (shoeSizes: Record<string, string>): string[] => {
  return Object.keys(shoeSizes).map((key) => shoeSizeMapping[key]);
};

/**
 * Generates a mapping of shoe variants based on shoe sizes, variant IDs, and color list.
 * @param shoe_sizes - The shoe sizes object.
 * @param variantIds - The array of variant IDs.
 * @param color_list - The array of colors.
 * @returns An object mapping shoe sizes to variant IDs.
 */
export const getShoeVariantsMapping = (shoe_sizes, variantIds, color_list) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(shoe_sizes).reduce((mapping, [key, _], index) => {
    const variants = chunkArray(variantIds, color_list.length)[index];
    mapping[key] = variants;
    return mapping;
  }, {});
};

/**
 * @example 'UHJvZHVjdFZhcmlhbnQ6ODc1MDI=' => '87502'
 */
export const idBase64Decode = (productId: string): string => {
  return atob(productId).split(':')[1];
};
