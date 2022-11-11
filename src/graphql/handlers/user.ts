// import { insertUserId } from 'src/postgres/handlers/user';
import { Logger } from '@nestjs/common';
import { createTokenInterface } from 'src/types/graphql/shop';
import { shopTransformed } from 'src/types/transformers/shop';
import {
  graphqlCall,
  graphqlCallByToken,
  graphqlCallSaleor,
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
    const createToken: createTokenInterface = await graphqlCallByToken(
      createSessionToken(),
      '',
    );
    const token = createToken.tokenCreate.token;
    const createUser = await graphqlCallByToken(
      createUserMutation(userData),
      token,
    );
    Logger.verbose('User created', createUser);
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
    const createToken: createTokenInterface = await graphqlCallSaleor(
      createSessionToken(),
    );
    const token = createToken.tokenCreate.token;
    const updateUser = await graphqlCallByToken(
      updateUserMutation(userUpdateData, destinationId),
      token,
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
    const createToken: createTokenInterface = await graphqlCall(
      createSessionToken(),
    );
    const token = createToken.tokenCreate.token;
    const deleteUserId = await graphqlCallByToken(
      deleteUserMutation(userId),
      token,
    );
    Logger.warn('user deleted', deleteUserHandler);
    return deleteUserId;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
