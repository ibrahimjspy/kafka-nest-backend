import client from '../../../pg-config';

/**
 * inserts in database
 * @params postgres database query for inserting
 */
export const postgresInsertCall = async (Query: string, retry = 0) => {
  await client.query(Query, []).catch(async (err) => {
    if (retry > 4) {
      console.warn('postgres error', err);
    }
    return await postgresInsertCall(Query, retry + 1);
  });
  return 'Successfully registered';
};
