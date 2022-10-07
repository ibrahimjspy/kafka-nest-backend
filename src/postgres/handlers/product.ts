import { Logger } from '@nestjs/common';
import client from '../config';

import {
  deleteProductIdQuery,
  insertProductIdQuery,
  productIdQuery,
} from '../queries/product';

//                       <fetch>

export const fetchProductId = async (sourceId: string): Promise<string> => {
  let id = null;
  await client
    .query(productIdQuery(sourceId), [])
    .then((res) => {
      console.log(res.rows);
      id = res.rows[0]?.destination_id;
    })
    .catch((err) => {
      console.warn('postgres error', err);
    });
  return id;
};

//                       <insert>

export const insertProductId = async (sourceId: string, destinationId) => {
  console.log(sourceId); // done
  console.log(destinationId.productCreate.errors);
  await client
    .query(
      insertProductIdQuery(sourceId, destinationId.productCreate.product.id),
      [],
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'product id inserted';
};

//                       <delete>

export const deleteProductId = async (destinationId) => {
  // console.log(destinationId.productCreate.errors);
  await client
    .query(deleteProductIdQuery(destinationId), [])
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'product deleted';
};
