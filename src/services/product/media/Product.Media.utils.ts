/**
 * returns variant ids against each color, using destination attribute mapping
 */
export const getVariantIdsByColor = (variantInformation, colorList) => {
  const variantData = {};
  colorList.map((color) => {
    variantData[color] = [];
    variantInformation.map((variant) => {
      if (variant.attributes[0].values[0].name == color)
        variantData[color].push(variant.id);
    });
  });
  return variantData;
};

/**
 * maps media against variants against their respective ids
 */
export const getVariantMediaById = (variantIds, mediaIds) => {
  const variantMedia = [];
  const variantColors = Object.keys(variantIds);
  variantColors?.map((color) => {
    variantIds[`${color}`].map((id) => {
      variantMedia.push({
        variantId: atob(id).split('ProductVariant:')[1],
        colorImage: mediaIds[`${color}`],
      });
    });
  });
  return variantMedia;
};
