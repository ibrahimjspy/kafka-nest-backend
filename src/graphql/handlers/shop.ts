import { deleteShopId, insertShopId } from 'src/postgres/handlers/shop';
import { shopTransformed } from 'src/types/shop';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { createShopMutation } from '../mutations/shop/create';
import { deleteShopMutation } from '../mutations/shop/delete';
import { updateShopMutation } from '../mutations/shop/update';

//  <-->  Create  <-->

export const createShopHandler = async (
  shopData: shopTransformed,
): Promise<object> => {
  try {
    const createShop: object = await graphqlCall(createShopMutation(shopData));
    console.log(createShop);
    insertShopId(shopData.id, createShop);
    return { ...createShop };
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
    return await graphqlCall(updateShopMutation(shopUpdateData, destinationId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Delete  <-->

export const deleteShopHandler = async (shopId: string): Promise<object> => {
  try {
    const data = await graphqlCall(deleteShopMutation(shopId));
    await deleteShopId(shopId);
    console.log(data);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
