import { stringValidation } from 'src/app.utils';
import { mediaDto } from 'src/transformer/types/product';

/**
 * returns variant ids against each color, using destination attribute mapping
 */
export const getVariantIdsByColor = (variantInformation, colorList) => {
  const variantData = {};
  (colorList || []).map((color) => {
    variantData[color] = [];
    (variantInformation || []).map((variant) => {
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
  (variantColors || []).map((color) => {
    variantIds[`${color}`].map((id) => {
      variantMedia.push({
        variantId: atob(id).split('ProductVariant:')[1],
        colorImage: mediaIds[`${color}`],
      });
    });
  });
  return variantMedia;
};

/**
 * @description -- this validates media array by checking if a url is faulty, if any url is faulty it replaces it with it nearest url size
 * @warn -- some url sizes still could be empty as some of url array have only empty arrays of url
 */
export const validateMediaArray = (mediaArray: mediaDto[]) => {
  mediaArray.map((media) => {
    const mediaSizes = Object.keys(media);
    mediaSizes.map((size, key) => {
      if (!media[`${size}`] || !stringValidation(media[`${size}`])) {
        if (key == mediaSizes.length + 1) {
          media[`${size}`] = media[`${mediaSizes[0]}`];
        }
        media[`${size}`] = media[`${mediaSizes[key + 1]}`];
      }
    });
  });
  return mediaArray;
};
