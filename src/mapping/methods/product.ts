/* eslint-disable @typescript-eslint/no-unused-vars */
import { deleteMapping, getMapping, insertMapping } from '../fetch';
import { getIdByElement, transformMappingsArray } from '../utils';
import { PRODUCT_ENGINE } from '../../../common.env';
import { Logger } from '@nestjs/common';
import { BulkProductResults } from 'src/services/product/Product.types';
import { chunkArray } from 'src/services/product/Product.utils';

/**
 * @returns product information in destination according to source Id
 */
export const getProductMapping = async (sourceId: string) => {
  return getIdByElement(
    'shr_b2b_product_id',
    await getMapping(PRODUCT_ENGINE, [
      {
        os_product_id: `${sourceId}`,
      },
    ]),
  );
};

/**
 * @returns all products mapping in bulk
 */
export const getAllMappings = async (pageNumber: number) => {
  const data = await getMapping(PRODUCT_ENGINE, [], pageNumber);
  return transformMappingsArray(data);
};

/**
 * Inserts the product mapping information into the destination based on the source ID.
 * @param {string} sourceId - The source product ID.
 * @param {string} destinationId - The destination product ID.
 * @param {string} shopId - The ID of the shop.
 * @returns {Promise<void>} A promise that resolves when the mapping is inserted.
 */
export const addProductMapping = async (sourceId, destinationId, shopId) => {
  try {
    const mappingData = {
      os_product_id: sourceId,
      shr_b2b_product_id: destinationId,
      tenant_id: shopId,
    };

    // Insert the product mapping
    await insertMapping(PRODUCT_ENGINE, mappingData);

    // Log the success message
    Logger.verbose(
      `Product mapping added: Source ID: ${sourceId}, Destination ID: ${destinationId}`,
    );
  } catch (error) {
    // Log the error
    Logger.error(
      `An error occurred while adding product mapping: ${error.message}`,
      error,
    );
    throw error;
  }
};

/**
 * @deletes product information in destination according to destination Id
 */
export const removeProductMapping = async (destinationId: string) => {
  const id = await getMapping(PRODUCT_ENGINE, {
    shr_b2b_product_id: destinationId,
  });
  return await deleteMapping(PRODUCT_ENGINE, getIdByElement('id', id));
};

/**
 * @param {string[]} sourceIds - Array of source productIds for which to get the destination productIds.
 * @returns {Promise<Map<string, string>>} A map with sourceId as keys and the corresponding destination productIds as values.
 */
export const getProductMappingBulk = async (
  sourceIds: string[],
): Promise<Map<string, string>> => {
  const productMapping: Map<string, string> = new Map();

  const mappingPromises = sourceIds.map(async (sourceId) => {
    const destinationProductId = await getIdByElement(
      'shr_b2b_product_id',
      await getMapping(PRODUCT_ENGINE, [
        {
          os_product_id: sourceId,
        },
      ]),
    );
    if (destinationProductId) {
      productMapping.set(sourceId, destinationProductId);
    }
  });

  await Promise.all(mappingPromises);
  return productMapping;
};

/**
 * Inserts the product mapping information into the destination based on the source ID.
 * @param {BulkProductResults[]} createdProducts - An array of BulkProductResults containing the products to map.
 * @param {string} shopId - The ID of the shop.
 * @returns {Promise<void>} A promise that resolves when the mapping is inserted.
 * @throws {Error} If there's an error while adding the product mapping.
 */
export const addBulkProductMapping = async (
  createdProducts: BulkProductResults[],
  shopId: string,
): Promise<void> => {
  try {
    /**
     * Prepare the mapping data by extracting the necessary information from the createdProducts array.
     * @type {Array<{ os_product_id: string; shr_b2b_product_id: string; tenant_id: string }>}
     */
    const mappingData = createdProducts.map((product) => {
      return {
        os_product_id: product.product.id,
        shr_b2b_product_id: product.product.id,
        tenant_id: shopId,
      };
    });

    // Insert the product mapping
    await insertMapping(PRODUCT_ENGINE, mappingData);

    // Log the success message
    Logger.verbose(
      `Product mapping added for ${createdProducts.length} products.`,
    );
  } catch (error) {
    // Log the error
    Logger.verbose(
      `An error occurred while adding product mapping: ${error.message}`,
      error,
    );
    throw new Error('Failed to add product mapping.');
  }
};

/**
 * Fetches destination product IDs based on the provided source IDs.
 *
 * @param {string[]} sourceIds - An array of source IDs.
 * @returns {Promise<string[]>} - A promise that resolves to an array of destination product IDs.
 */
export const getDestinationProductIds = async (
  sourceIds: string[],
): Promise<string[]> => {
  let destinationIds: string[] = [];
  const BATCH_SIZE = 100;

  // Split the sourceIds into batches of 100 each
  const batches = chunkArray(sourceIds, BATCH_SIZE);

  for (const batch of batches) {
    const mappings = await getMapping(PRODUCT_ENGINE, [
      {
        os_product_id: batch,
      },
    ]);

    const batchDestinationIds: string[] = mappings.map(
      (mapping) => mapping.shr_b2b_product_id.raw,
    );

    destinationIds = destinationIds.concat(batchDestinationIds);
  }

  return destinationIds;
};
