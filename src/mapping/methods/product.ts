/* eslint-disable @typescript-eslint/no-unused-vars */
import { deleteMapping, getMapping, insertMapping } from '../fetch';
import { getIdByElement, transformMappingsArray } from '../utils';
import { PRODUCT_ENGINE } from '../../../common.env';
import { Logger } from '@nestjs/common';

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
