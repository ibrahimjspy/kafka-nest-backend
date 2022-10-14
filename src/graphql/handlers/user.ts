import { deleteUserId, insertUserId } from 'src/postgres/handlers/user';
import { shopTransformed } from 'src/types/shop';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { createUserMutation } from '../mutations/user/create';
import { deleteUserMutation } from '../mutations/user/delete';
import { updateUserMutation } from '../mutations/user/update';

//  <-->  Create  <-->

export const createUserHandler = async (
  userData: shopTransformed,
): Promise<object> => {
  try {
    const createUser: object = await graphqlCall(createUserMutation(userData));
    console.log(createUser);
    insertUserId(userData.id, createUser);
    return { ...createUser };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Update  <-->

export const updateUserHandler = async (
  userUpdateData: shopTransformed,
  destinationId: string,
): Promise<object> => {
  try {
    return await graphqlCall(updateUserMutation(userUpdateData, destinationId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Delete  <-->

export const deleteUserHandler = async (userId: string): Promise<object> => {
  try {
    const data = await graphqlCall(deleteUserMutation(userId));
    await deleteUserId(userId);
    console.log(data);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
