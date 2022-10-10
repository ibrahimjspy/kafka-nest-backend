import { Logger } from '@nestjs/common';
import client from 'src/postgres/config';

/**
 * inserts source product and brand details against its product_id
 * @params postgres database query for inserting id
 * @warn currently only compatible with source and destination id
 */
export const postgresInsertCall = async (Query: string) => {
  await client
    .query(Query, [])
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'Successfully registered';
};
