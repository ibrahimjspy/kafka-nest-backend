//                       <fetch>

import { Logger } from '@nestjs/common';
import { postgresDeleteCall } from 'src/database/postgres/call/delete';
import { postgresFetchIdCall } from 'src/database/postgres/call/fetch';
import { postgresInsertCall } from 'src/database/postgres/call/insert';
import {
  deleteShopIdQuery,
  insertShopIdQuery,
  shopIdQuery,
} from '../queries/shop';

export const fetchShopId = async (sourceId: string): Promise<string> => {
  return await postgresFetchIdCall(shopIdQuery(sourceId));
};

//                       <insert>

export const insertShopId = async (sourceId: string, destinationId) => {
  try {
    if (destinationId.createShop.createMarketplaceShop.id) {
      return await postgresInsertCall(
        insertShopIdQuery(sourceId, destinationId),
      );
    }
  } catch (error) {
    Logger.log('error');
  }
};

//                       <delete>

export const deleteShopId = async (destinationId) => {
  return await postgresDeleteCall(deleteShopIdQuery(destinationId));
};
