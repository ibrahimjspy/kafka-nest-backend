import { Logger } from '@nestjs/common';
import {
  DestinationShopInterface,
  shopTransformed,
} from 'src/transformer/types/shop';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import { createShopMutation } from '../mutations/shop/create';
import { deleteShopMutation } from '../mutations/shop/delete';
import { updateShopMutation } from '../mutations/shop/update';
import { shopDetailsQuery } from '../queries/shop';

//  <-->  Create  <-->

export const getShopHandler = async (shopId: string) => {
  try {
    const shopDetails: object = await graphqlCall(shopDetailsQuery(shopId));
    return shopDetails['marketplaceShop'] as DestinationShopInterface;
  } catch (err) {
    graphqlExceptionHandler(err);
    return;
  }
};

//  <-->  Create  <-->

export const createShopHandler = async (shopData: shopTransformed) => {
  try {
    // creates shop against that user
    const createShop: object = await graphqlCall(createShopMutation(shopData));
    Logger.verbose('Marketplace shop created', createShop);
    const shopId: string = createShop['createMarketplaceShop']?.id;
    return shopId;
  } catch (err) {
    graphqlExceptionHandler(err);
    return;
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
