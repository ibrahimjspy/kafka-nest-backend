import { Logger } from '@nestjs/common';
import { addShippingZoneToShopMutation } from '../mutations/shop/shippingMethod/shippingZone/addZoneToShop';
import { graphqlCall, graphqlExceptionHandler } from '../utils/call';
import { getShippingZonesQuery } from '../queries/shipping';
import { ShippingZoneType } from '../types/shippingZone';

export const addShippingZoneHandler = async (
  shopId: string,
  shippingZoneId: string,
): Promise<any> => {
  try {
    const addShippingZone = await graphqlCall(
      addShippingZoneToShopMutation(shopId, shippingZoneId),
    );
    Logger.verbose('shipping zone added', addShippingZone);
    return addShippingZone;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const getDefaultShippingZoneHandler =
  async (): Promise<ShippingZoneType> => {
    const response = await graphqlCall(getShippingZonesQuery());
    return response['shippingZones'];
  };
