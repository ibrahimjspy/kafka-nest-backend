import { Logger } from '@nestjs/common';
import { addShippingZoneToShopMutation } from '../mutations/shop/shippingMethod/shippingZone/addZoneToShop';
import { graphqlCall, graphqlExceptionHandler } from '../utils/call';

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
