//                       <insert>

import { Logger } from '@nestjs/common';
import { postgresInsertCall } from '../call/insert';
import { updateProductTimestampsQuery } from '../queries/product';

export const updateProductTimestamp = async (
  productId: string,
  createdAt: string,
  updatedAt: string,
) => {
  Logger.log('Updating product timestamps', productId);
  return await postgresInsertCall(
    updateProductTimestampsQuery(productId, createdAt, updatedAt),
  );
};
