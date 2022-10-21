import { Logger } from '@nestjs/common';
import { shopTransformed } from 'src/types/shop';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import {
  addUserToMarketplace,
  createShopMutation,
} from '../mutations/shop/create';
import { deleteShopMutation } from '../mutations/shop/delete';
import { updateShopMutation } from '../mutations/shop/update';

//  <-->  Create  <-->

export const createShopHandler = async (
  shopData: shopTransformed,
  userId,
): Promise<object> => {
  try {
    // registers user id in shop service
    const addShop = await graphqlCall(
      addUserToMarketplace(userId.createUser.staffCreate.user.id),
    );
    // creates shop against that user
    const createShop: object = await graphqlCall(
      createShopMutation(shopData, userId.createUser.staffCreate.user.id),
    );
    Logger.verbose('Marketplace shop created', createShop);
    return { ...addShop, createShop };
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
