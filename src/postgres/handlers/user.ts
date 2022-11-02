import { Logger } from '@nestjs/common';
import { postgresDeleteCall } from 'src/utils/postgres/delete';
import { postgresFetchIdCall } from 'src/utils/postgres/fetch';
import { postgresInsertCall } from 'src/utils/postgres/insert';
import {
  deleteUserIdQuery,
  insertUserIdQuery,
  userIdQuery,
} from '../queries/user';

export const fetchUserId = async (sourceId: string): Promise<string> => {
  return await postgresFetchIdCall(userIdQuery(sourceId));
};

//                       <insert>

export const insertUserId = async (sourceId: string, destinationId) => {
  try {
    if (destinationId.createUser.staffCreate.user.id) {
      return await postgresInsertCall(
        insertUserIdQuery(sourceId, destinationId),
      );
    }
  } catch (error) {
    Logger.log('error');
  }
};

//                       <delete>

export const deleteUserId = async (destinationId) => {
  return await postgresDeleteCall(deleteUserIdQuery(destinationId));
};
