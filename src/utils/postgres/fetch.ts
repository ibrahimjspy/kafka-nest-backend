import { Logger } from '@nestjs/common';
import client from 'src/postgres/config';

/**
 * fetches source product and brand details against its product_id
 * @params postgres database query for fetching id
 * @warn currently only compatible with source and destination id
 */
export const postgresFetchCall = async (Query: string) => {
  let data = '';
  await client
    .query(Query, [])
    .then((res) => {
      console.log(res);
      data = res.rows[0]?.destination_id;
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return data;
};
