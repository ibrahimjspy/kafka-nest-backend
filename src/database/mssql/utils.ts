/**
 * this function is like a transformer with builder pattern built in
 * what it basically does is that it takes raw db removes unnecessary information
 * create a mappable array containing bundles
 */
export const getShoeBundles = (dbBundle) => {
  const bundles = [];
  dbBundle.TBVendorShoeSize_ID.map((bundle) => {
    const bundleArray = Object.entries(bundle);
    console.log(bundle);
    const filterArray = bundleArray.filter(
      ([key, value]) =>
        value !== '0' &&
        value !== '' &&
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
 * what this utility does is that it creates an array which contains a union of sizes in all bundles
 * @point these are all available sizes against that shoe
 * @implementation at a higher level it still is using basic iteration and creating a hash map using javascript spread operator
 */
export const getShoeSizes = (bundles) => {
  let sizeUnion = {};
  bundles.map((bundle) => {
    sizeUnion = { ...sizeUnion, ...bundle };
  });
  return sizeUnion;
};
