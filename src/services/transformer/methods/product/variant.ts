/**
 * This function returns variants based on color and its sizes
 * @params color to be created as variant
 * @params array of sizes to be mapped with color
 * @returns collection of variants to be created <Array>
 */
export const colorVariantTransformerMethod = (
  color: string,
  sizes: string[],
) => {
  const array = [];
  sizes.map((s) => {
    const object: any = { color: color };
    object.size = s;
    array.push(object);
  });
  return array;
};
