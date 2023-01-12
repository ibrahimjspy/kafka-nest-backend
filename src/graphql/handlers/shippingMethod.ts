import { Logger } from '@nestjs/common';
import { shippingMethodDto } from 'src/transformer/types/shop';
import { shippingMethodChannelListingMutation } from '../mutations/shop/shippingMethod/addToChannel';
import { addShippingMethodToShopMutation } from '../mutations/shop/shippingMethod/addToShop';
import { createShippingMethodMutation } from '../mutations/shop/shippingMethod/create';
import { graphqlCall, graphqlExceptionHandler } from '../utils/call';

export const createShippingMethodHandler = async (
  shippingMethodData: shippingMethodDto,
): Promise<object> => {
  try {
    const createMethod = await graphqlCall(
      createShippingMethodMutation(shippingMethodData),
    );
    const shippingMethodId =
      createMethod['shippingPriceCreate']?.shippingMethod?.id;

    await shippingMethodChannelListing(shippingMethodId);
    Logger.verbose('Shipping method added', createMethod);

    return shippingMethodId;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const shippingMethodChannelListing = async (
  shippingMethodId: string,
): Promise<object> => {
  try {
    const addToChannel = await graphqlCall(
      shippingMethodChannelListingMutation(shippingMethodId),
    );
    return addToChannel;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const addShippingMethodHandler = async (
  shopId: string,
  shippingMethodId: string[],
): Promise<any> => {
  try {
    const addShippingMethods = await graphqlCall(
      addShippingMethodToShopMutation(shopId, shippingMethodId),
    );
    Logger.verbose('shipping method added', addShippingMethods);
    return addShippingMethods;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
