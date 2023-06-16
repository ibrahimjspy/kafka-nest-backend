import {
  deleteMapping,
  getMapping,
  insertMapping,
  updateMapping,
} from '../fetch';
import { getIdByElement } from '../utils';
import { SHOP_ENGINE } from '../../../common.env';
import { ShopMappingType } from '../types';

/**
 * @returns shop mapping information in destination according to source Id
 */
export const getShopMapping = async (sourceId: string) => {
  const response = await getMapping(SHOP_ENGINE, [
    {
      os_vendor_id: `${sourceId}`,
    },
  ]);
  const shopId = getIdByElement('shr_shop_id', response);
  const documentId = getIdByElement('id', response);
  const shopName = getIdByElement('shr_shop_name', response);
  return { shopId, documentId, shopName };
};

/**
 * @posts shop mapping information in destination according to source Id
 */
export const addShopMapping = async (shopMapping: ShopMappingType) => {
  const { sourceId, destinationId, shopName } = shopMapping;

  return await insertMapping(SHOP_ENGINE, {
    os_vendor_id: sourceId,
    shr_shop_id: destinationId,
    shr_shop_name: shopName,
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

/**
 * @updates shop mapping information in destination according to source Id
 */
export const updateShopMapping = async (
  id: string,
  shopMapping: ShopMappingType,
) => {
  const { sourceId, destinationId, shopName } = shopMapping;
  return await updateMapping(SHOP_ENGINE, {
    id: id,
    os_vendor_id: sourceId,
    shr_shop_id: destinationId,
    shr_shop_name: shopName,
  });
};
