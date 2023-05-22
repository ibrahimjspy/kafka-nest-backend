import { deleteMapping, getMapping, insertMapping } from '../fetch';
import { getIdByElement } from '../utils';
import { SHOP_ENGINE } from '../../../common.env';

/**
 * @returns shop mapping information in destination according to source Id
 */
export const getShopMapping = async (sourceId: string) => {
  return getIdByElement(
    'shr_shop_id',
    await getMapping(SHOP_ENGINE, [
      {
        os_vendor_id: `${sourceId}`,
      },
    ]),
  );
};

/**
 * @posts shop mapping information in destination according to source Id
 */
export const addShopMapping = async (
  sourceId: string,
  destinationId: string,
) => {
  return await insertMapping(SHOP_ENGINE, {
    os_vendor_id: sourceId,
    shr_shop_id: destinationId,
  });
};

/**
 * @deletes shop mapping information in destination according to source Id
 */
export const removeShopMapping = async (destinationId: string) => {
  const id = await getMapping(SHOP_ENGINE, {
    shr_shop_id: destinationId,
  });
  return await deleteMapping(SHOP_ENGINE, getIdByElement('id', id));
};
