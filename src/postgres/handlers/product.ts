import { Logger } from '@nestjs/common';
import client from '../config';

import { insertProductIdQuery, productIdQuery } from '../queries/product';

export const fetchProductId = async (sourceId: string): Promise<string> => {
  let id = null;
  await client
    .query(productIdQuery(sourceId), [])
    .then((res) => {
      Logger.log(res.rows);
      id = null;
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return id;
};

export const insertProductId = async (sourceId: string, destinationId) => {
  console.log(sourceId); // done
  console.log(destinationId.productCreate.product.id);
  await client
    .query(
      insertProductIdQuery(sourceId, destinationId.productCreate.product.id),
      [],
    )
    .then((res) => {
      Logger.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'product id inserted';
};
