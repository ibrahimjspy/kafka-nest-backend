import { shoeSizeMapping } from 'src/transformer/product/Product.transformer.utils';
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
    return media.url.split('media/')[1];
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

/**
 *  finds given shoe size variants then transforms it in a mappable array of bundles
 */
export const getShoeBundlesBySizes = (shoeVariants, bundleSizes, length) => {
  const matchingVariants = [];
  const bundles = [];
  let i;
  Object.keys(bundleSizes).forEach(function (key) {
    matchingVariants.push(shoeVariants[`${key}`]);
  });
  for (i = 0; i < length; i++) {
    bundles.push([]);
  }
  matchingVariants.map((bundle) => {
    bundle.map((variant, key) => {
      bundles[key].push(variant);
    });
  });
  return bundles;
};

/**
 * returns shoe sizes against table column names of shoe mapping
 * @example s5 => 5.0 , s5h => 5.5
 * @links shoe mapping object
 */
export const getShoeSizes = (shoe_sizes) => {
  const sizes = [];
  Object.keys(shoe_sizes).forEach(function (key) {
    sizes.push(shoeSizeMapping[key]);
  });
  return sizes;
};

/**
 * maps shoe variants according to colors
 * @example {size : ['variantID1', 'variantID2']}
 */
export const getShoeVariantsMapping = (shoe_sizes, variantIds, color_list) => {
  const shoeVariantIdMapping = {};
  Object.keys(shoe_sizes).forEach(function (key, index) {
    shoeVariantIdMapping[`${key}`] = chunkArray(variantIds, color_list.length)[
      index
    ];
  });
  return shoeVariantIdMapping;
};
