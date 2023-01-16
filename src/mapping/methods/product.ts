/* eslint-disable @typescript-eslint/no-unused-vars */
import { deleteMapping, getMapping, insertMapping } from '../fetch';
import { getIdByElement } from '../utils';
import { PRODUCT_ENGINE } from '../../../common.env';

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
 * @posts product information in destination according to source Id
 */
export const addProductMapping = async (sourceId, destinationId, shopId) => {
  return await insertMapping(PRODUCT_ENGINE, {
    os_product_id: sourceId,
    shr_b2b_product_id: destinationId,
    tenant_id: shopId,
  });
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
