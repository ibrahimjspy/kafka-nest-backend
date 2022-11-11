import { Logger } from '@nestjs/common';
import client from '../../../pg-config';

/**
 * fetches source product and brand details against its product_id
 * @params postgres database query for fetching id
 * @warn currently only compatible id
 * @returns uuid || serial 4 id
 */
export const postgresFetchIdCall = async (Query: string, retry = 0) => {
  let data = null;
  await client
    .query(Query, [])
    .then((res) => {
      // Logger.log('Successfully fetched from postgres database', res);
      data = res.rows[0]?.destination_id ? res.rows[0]?.destination_id : null;
    })
    .catch(async (err) => {
      if (retry > 4) {
        Logger.warn('postgres error', err);
      }
      return await postgresFetchIdCall(Query, retry + 1);
    });
  return data;
};

/**
 * fetches source product and brand details against its product_id
 * @params postgres database query for fetching id
 * @warn currently only compatible id
 * @returns uuid || serial 4 id
 */
export const postgresFetchMediaIdCall = async (Query: string, retry = 0) => {
  let data = null;
  await client
    .query(Query, [])
    .then((res) => {
      // Logger.log('Successfully fetched from postgres database', res);
      data = res.rows[0]?.id ? res.rows[0]?.id : null;
    })
    .catch(async (err) => {
      if (retry > 4) {
        Logger.warn('postgres error', err);
      }
      return await postgresFetchMediaIdCall(Query, retry + 1);
    });
  return data;
};
