/**
 * returns shoe bundles out of database ShoeDetails column
 */
export const getShoeBundles = (dbBundle) => {
  const bundles = [];
  dbBundle.TBVendorShoeSize_ID.map((bundle) => {
    const bundleArray = Object.entries(bundle);

    const filterArray = bundleArray.filter(
      ([key, value]) =>
        value !== '0' &&
        !key.startsWith('sn') &&
        !key.startsWith('TBVendorShoeSize_ID') &&
        !key.startsWith('ShoeSizeName') &&
        !key.startsWith('Description') &&
        !key.startsWith('TBVendor_ID') &&
        !key.startsWith('is_favorite'),
    );

    bundles.push(Object.fromEntries(filterArray));
  });
  return bundles;
};

/**
 * returns shoe sizes union which could be used to create variants from shoe bundles
 */
export const getShoeSizes = (bundles) => {
  let sizeUnion = {};
  bundles.map((bundle) => {
    sizeUnion = { ...sizeUnion, ...bundle };
  });
  return sizeUnion;
};
