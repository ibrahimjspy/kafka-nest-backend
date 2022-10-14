import { postgresFetchCall } from 'src/utils/postgres/fetch';
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
  // console.log(sourceId); // done
  // console.log(destinationId.UserCreate.errors);
  return await postgresFetchCall(
    insertUserIdQuery(sourceId, destinationId.StaffCreate.User.id),
  );
};

//                       <delete>

export const deleteUserId = async (destinationId) => {
  // console.log(destinationId.UserCreate.errors);
  return await postgresFetchCall(deleteUserIdQuery(destinationId));
};
