import { Logger } from '@nestjs/common';
import { postgresFetchIdCall } from '../call/fetch';
import { postgresInsertCall } from '../call/insert';
import {
  insertShippingIdQuery,
  shippingMethodIdQuery,
} from '../queries/shippingMethod';

export const fetchShippingMethodId = async (
  sourceId: string,
): Promise<string> => {
  return await postgresFetchIdCall(shippingMethodIdQuery(sourceId));
};

export const insertShippingMethodId = async (
  sourceId: string,
  destinationId,
) => {
  try {
    if (destinationId) {
      return await postgresInsertCall(
        insertShippingIdQuery(sourceId, destinationId),
      );
    }
  } catch (error) {
    Logger.log('error');
  }
};
