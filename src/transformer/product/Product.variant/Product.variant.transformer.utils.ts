/**
 * Removes unnecessary information from the raw db object and creates a mappable array of bundles.
 * @param {Object} dbBundle - The raw db object containing bundles.
 * @returns {Array} The mappable array of bundles.
 */
export const getShoeBundlesFromDb = (dbBundle) => {
  const bundles = [];

  dbBundle.TBVendorShoeSize_ID.forEach((bundle) => {
    const bundleArray = Object.entries(bundle);
    const filterArray = bundleArray.filter(([key, value]) =>
      isBundleProperty(key, value),
    );

    bundles.push(Object.fromEntries(filterArray));
  });

  return bundles;
};

/**
 * Checks if a key-value pair represents a valid bundle property.
 * @param {string} key - The key of the property.
 * @param {string} value - The value of the property.
 * @returns {boolean} True if the property is valid, false otherwise.
 */
const isBundleProperty = (key, value) => {
  const excludedPrefixes = [
    'sn',
    'TBVendorShoeSize_ID',
    'ShoeSizeName',
    'Description',
    'TBVendor_ID',
    'is_favorite',
  ];

  return (
    value !== '0' &&
    value !== '' &&
    !excludedPrefixes.some((prefix) => key.startsWith(prefix))
  );
};

/**
 * @description - what this utility does is that it creates an array which contains a union of sizes column names of db in all bundles
 * @point these are all available sizes against that shoe
 * @implementation at a higher level it still is using basic iteration and creating a hash map using javascript spread operator
 */
export const getShoeSizeColumns = (bundles) => {
  let sizeUnion = {};
  bundles.map((bundle) => {
    sizeUnion = { ...sizeUnion, ...bundle };
  });
  return sizeUnion;
};

/**
 * @description - returns bundle names in sorted manner
 */
export const getShoeBundleNames = (bundles) => {
  const bundlesNames = [];
  bundles.TBVendorShoeSize_ID.map((bundle) => {
    const bundleArray = Object.entries(bundle);
    const filterArray = bundleArray.filter(([key]) =>
      key.startsWith('ShoeSizeName'),
    );
    bundlesNames.push(Object.fromEntries(filterArray));
  });
  return bundlesNames;
};
