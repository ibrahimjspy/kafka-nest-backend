// import { insertUserId } from 'src/postgres/handlers/user';
import { Logger } from '@nestjs/common';
import { shopTransformed } from 'src/types/shop';
import {
  graphqlCall,
  graphqlCallDynamic,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import {
  createSessionToken,
  createUserMutation,
} from '../mutations/user/create';
import { deleteUserMutation } from '../mutations/user/delete';
import { updateUserMutation } from '../mutations/user/update';

//  <-->  Create  <-->

export const createUserHandler = async (
  userData: shopTransformed,
): Promise<object> => {
  try {
    const createToken = await graphqlCall(createSessionToken());
    const createUser = await graphqlCallDynamic(
      createUserMutation(userData),
      createToken,
    );
    Logger.verbose(createUser.staffCreate);
    return { createUser };
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
    const createToken = await graphqlCall(createSessionToken());
    const updateUser = await graphqlCallDynamic(
      updateUserMutation(userUpdateData, destinationId),
      createToken,
    );
    Logger.log('user updated', updateUser);
    return updateUser;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Delete  <-->

export const deleteUserHandler = async (userId: string): Promise<object> => {
  try {
    const createToken = await graphqlCall(createSessionToken());
    const deleteUserId = await graphqlCallDynamic(
      deleteUserMutation(userId),
      createToken,
    );
    Logger.warn('user deleted', deleteUserHandler);
    return deleteUserId;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
