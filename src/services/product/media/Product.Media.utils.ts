import { stringValidation } from 'src/app.utils';
import { mediaDto } from 'src/transformer/types/product';

/**
 * Returns variant IDs corresponding to each color using destination attribute mapping.
 *
 * @param variantInformation - Array of variant information objects.
 * @param colorList - Array of color objects.
 * @returns An object containing color names as keys and corresponding variant IDs as values.
 */
export const getVariantIdsByColor = (variantInformation, colorList) => {
  // Object to store variant IDs corresponding to each color
  const variantData = {};

  // Iterate over each color in the colorList array
  (colorList || []).forEach((color) => {
    const colorName = color.cColorName;

    // Initialize an empty array to store variant IDs for the current color
    variantData[colorName] = [];

    // Iterate over each variant in the variantInformation array
    (variantInformation || []).forEach((variant) => {
      const variantAttribute = variant.attributes[0];

      // Check if the variant's attribute matches the current color name
      if (variantAttribute.values[0].name === colorName) {
        // Push the variant's ID to the array of variant IDs for the current color
        variantData[colorName].push(variant.id);
      }
    });
  });

  // Return the object containing color names as keys and variant IDs as values
  return variantData;
};

/**
 * Maps media against variants using their respective IDs.
 *
 * @param variantIds - Object containing variant IDs mapped by color.
 * @param mediaIds - Object containing media IDs mapped by color.
 * @returns An array of variant media objects, each containing variant ID and color image.
 */
export const getVariantMediaById = (variantIds, mediaIds) => {
  const variantMedia = [];

  const variantColors = Object.keys(variantIds);

  (variantColors || []).forEach((color) => {
    variantIds[color].forEach((id) => {
      const variantId = atob(id).split('ProductVariant:')[1];
      const colorImage = mediaIds[color];

      variantMedia.push({
        variantId,
        colorImage,
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
          media[`${size}`] = media[`${mediaSizes[key - 1]}`];
        }
        media[`${size}`] = media[`${mediaSizes[key + 1]}`];
      }
    });
  });
  return mediaArray;
};
