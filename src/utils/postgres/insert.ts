import { Logger } from '@nestjs/common';
import client from '../../../pg-config';

/**
 * inserts in database
 * @params postgres database query for inserting
 */
export const postgresInsertCall = async (Query: string) => {
  await client
    .query(Query, [])
    .then((res) => {
      Logger.verbose('Successfully inserted', res);
    })
    .catch((err) => {
      console.warn('postgres error', err);
    });
  return 'Successfully registered';
};
