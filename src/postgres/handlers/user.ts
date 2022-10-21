import { postgresDeleteCall } from 'src/utils/postgres/delete';
import { postgresFetchCall } from 'src/utils/postgres/fetch';
import { postgresInsertCall } from 'src/utils/postgres/insert';
import {
  deleteUserIdQuery,
  insertUserIdQuery,
  userIdQuery,
} from '../queries/user';

export const fetchUserId = async (sourceId: string): Promise<string> => {
  return await postgresFetchCall(userIdQuery(sourceId));
};

//                       <insert>

export const insertUserId = async (sourceId: string, destinationId) => {
  return await postgresInsertCall(insertUserIdQuery(sourceId, destinationId));
};

//                       <delete>

export const deleteUserId = async (destinationId) => {
  return await postgresDeleteCall(deleteUserIdQuery(destinationId));
};
