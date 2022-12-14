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
  const transformedDestinationMedia = destinationMedia.map((media) => {
    return media.url.split('media/ColorSwatch/')[1];
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
 *  @step This function first maps given bundle sizes against shoeVariants object{containing all variants of all sizes} and get variants against that particular size
 *  @step secondly after getting variants of given sizes it create a state containing bundles
 *  bundles simply is made by first creating sub array of color length as in our requirement each bundle is made against one color
 *  after creating empty 2D array we start our main job : ==> ***
 *  @step it maps our matching variants of that given bundle all ready in form of [{color1Variant, color2Variant, color3Variant}]
 *  and uses its index to add in bundles 2d array made according to colors
 *  @result [[color1Variant],[color2Variant],[color3Variant]]
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
 * right now when we create bulk variants we get a composite array containing variants like this
 * @example [Small-Red-Variant,Small-Blue-Variant,Small-Green-Variant,Large-Red-Variant, .......]
 * this utility simple just takes shoeSizes in a sorted manner , takes colors length and returns an object like this:
 * @result @example {Small: [Small-Red-Variant,Small-Blue-Variant,Small-Green-Variant], Large: [....]}
 * @work this function result can later be used to map our sizes against variantIds so we can easily create bundles
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

/**
 * @example 'UHJvZHVjdFZhcmlhbnQ6ODc1MDI=' => '87502'
 */
export const idBase64Decode = (productId: string): string => {
  return atob(productId).split(':')[1];
};
