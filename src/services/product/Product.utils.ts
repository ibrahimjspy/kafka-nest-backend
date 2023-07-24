import { shoeSizeMapping } from 'src/transformer/product/Product.transformer.utils';
import { mediaDto, productTransformed } from 'src/transformer/types/product';
import { BulkProductResults, BulkProductFail } from './Product.types';

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

export const getBundlePrice = (
  bundleQuantities: number[],
  productPrice: number,
): number => {
  let bundlePrice = 0;
  bundleQuantities.map((quantity) => {
    bundlePrice = bundlePrice + quantity * productPrice;
  });
  return bundlePrice;
};

export const getSourceProductIds = (
  products: productTransformed[],
): string[] => {
  return products.map((product) => product.id);
};

/**
 * @param {productTransformed[]} products - Array of transformed products.
 * @param {Map<string, string>} productMapping - Map with sourceId as keys and destination productIds as values.
 * @returns {productTransformed[]} Array of products that do not have a corresponding destination productId in the productMapping.
 */
export const getNonExistentProducts = (
  products: productTransformed[],
  productMapping: Map<string, string>,
): productTransformed[] => {
  const destinationProductIdsSet = new Set(productMapping.keys());
  return products.filter(
    (product) => !destinationProductIdsSet.has(product.id),
  );
};

/**
 * Filters an array of mixed objects containing instances of BulkProductResults and BulkProductFail
 * and returns an array containing only the instances of BulkProductResults.
 * @param {Array<BulkProductResults | BulkProductFail>} products - The array of mixed objects.
 * @returns {BulkProductResults[]} An array containing only the instances of BulkProductResults.
 */
export const validateCreatedProducts = (
  products: Array<BulkProductResults | BulkProductFail>,
): BulkProductResults[] => {
  return products.filter(
    (product) => product.product !== null,
  ) as BulkProductResults[];
};

/**
 * Transforms an array of productTransformed objects into a Map with product IDs as keys and the corresponding productTransformed objects as values.
 * @param {productTransformed[]} products - An array of productTransformed objects to be transformed into a Map.
 * @returns {Map<string, productTransformed>} A Map with product IDs as keys and corresponding productTransformed objects as values.
 */
export const getTransformedProductsMapping = (
  products: productTransformed[],
): Map<string, productTransformed> => {
  /**
   * A Map containing product IDs as keys and corresponding productTransformed objects as values.
   * @type {Map<string, productTransformed>}
   */
  const productMapping: Map<string, productTransformed> = new Map();

  products.forEach((product) => {
    productMapping.set(product.id, product);
  });

  return productMapping;
};
