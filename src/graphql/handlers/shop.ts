import { Logger } from '@nestjs/common';
import { shopTransformed } from 'src/transformer/types/shop';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import { createShopMutation } from '../mutations/shop/create';
import { deleteShopMutation } from '../mutations/shop/delete';
import { updateShopMutation } from '../mutations/shop/update';

//  <-->  Create  <-->

export const createShopHandler = async (
  shopData: shopTransformed,
): Promise<object> => {
  try {
    // creates shop against that user
    const createShop: object = await graphqlCall(
      createShopMutation(shopData, 'test'),
    );
    Logger.verbose('Marketplace shop created', createShop);
    return { createShop };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Update  <-->

export const updateShopHandler = async (
  shopUpdateData: shopTransformed,
  destinationId: string,
): Promise<object> => {
  try {
    const updateShop = await graphqlCall(
      updateShopMutation(shopUpdateData, destinationId),
    );
    Logger.verbose('MarketplaceShop updated', updateShop);
    return updateShop;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Delete  <-->

export const deleteShopHandler = async (shopId: string): Promise<object> => {
  try {
    const deleteShop = await graphqlCall(deleteShopMutation(shopId));
    Logger.warn('MarketplaceShop deleted', deleteShop);
    return deleteShop;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
