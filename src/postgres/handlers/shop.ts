//                       <fetch>

import { postgresFetchCall } from 'src/utils/postgres/fetch';
import {
  deleteShopIdQuery,
  insertShopIdQuery,
  shopIdQuery,
} from '../queries/shop';

export const fetchShopId = async (sourceId: string): Promise<string> => {
  return await postgresFetchCall(shopIdQuery(sourceId));
};

//                       <insert>

export const insertShopId = async (sourceId: string, destinationId) => {
  // console.log(sourceId); // done
  // console.log(destinationId.ShopCreate.errors);
  return await postgresFetchCall(
    insertShopIdQuery(sourceId, destinationId.ShopCreate.Shop.id),
  );
};

//                       <delete>

export const deleteShopId = async (destinationId) => {
  // console.log(destinationId.ShopCreate.errors);
  return await postgresFetchCall(deleteShopIdQuery(destinationId));
};
