import { Logger } from '@nestjs/common';
import client from '../../../pg-config';

/**
 * inserts source product and brand details against its product_id
 * @params postgres database query for inserting id
 * @warn currently only compatible with source and destination id
 */
export const postgresDeleteCall = async (Query: string) => {
  await client
    .query(Query, [])
    .then((res) => {
      Logger.warn('Deleted from database', res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'Successfully deleted';
};
