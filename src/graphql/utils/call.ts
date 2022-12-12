import { Logger } from '@nestjs/common';
import { FEDERATION_ENDPOINT, SALEOR_ENDPOINT } from 'common.env';
import { GraphQLClient } from 'graphql-request';
type GraphqlCall = (Query: string, retries?: number) => Promise<object>;
/**
 * This is top level function which handles graphql requests , exceptions and logic
 * @params Query ,  It must be in string format and no query based
 * logic should be transferred to graphqlHandler
 * @note This function determines its endpoint logic through another public method graphqlHandler() which
 * is based on env files content .
 * @returns an object with data or graphql error
 */
export const graphqlCall: GraphqlCall = async (
  Query: string,
  retries = 5,
): Promise<any> => {
  try {
    let data = {};
    const graphQLClient = new GraphQLClient(FEDERATION_ENDPOINT, {
      headers: {
        authorization: `Bearer ${process.env.AUTHORIZATION_HEADER}`,
      },
    });
    await graphQLClient.request(Query).then((res) => {
      data = res;
    });
    return data;
  } catch (error) {
    console.log(error);
    if (retries === 0) {
      Logger.error(`retries call finished`);
      throw error;
    }
    Logger.warn('retrying', Query.split('(')[0]);
    return await graphqlCall(Query, retries - 1);
  }
};

/**
 * This is top level function which handles graphql requests , exceptions and logic
 * @params Query ,  It must be in string format and no query based
 * logic should be transferred to graphqlHandler
 * @note This function determines its endpoint logic through another public method graphqlHandler() which
 * is based on env files content .
 * @returns an object with data or graphql error
 */
export const graphqlCallSaleor: GraphqlCall = async (
  Query: string,
  retries = 5,
): Promise<any> => {
  let data = {};
  const graphQLClient = new GraphQLClient(SALEOR_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.AUTHORIZATION_HEADER_APP}`,
    },
  });
  try {
    await graphQLClient.request(Query).then((res) => {
      data = res;
    });
  } catch (error) {
    if (retries === 0) {
      Logger.error(`retries call finished`);
      throw error;
    }
    Logger.warn('retrying', Query.split('(')[0]);
    await graphqlCall(Query, retries - 1);
  }
  return data;
};

/**
 * This is graphql call with dynamic authorization token
 * @params Query ,  It must be in string format and no query based
 * logic should be transferred to graphqlHandler
 * @params Auth token {string} ,  It must be in string format and no query based
 * @returns an object with data or graphql error
 */
export const graphqlCallByToken = async (
  Query: string,
  Token: string,
): Promise<any> => {
  let data = {};
  const graphQLClient = new GraphQLClient(SALEOR_ENDPOINT, {
    headers: {
      authorization: `Bearer ${Token}`,
    },
  });
  await graphQLClient.request(Query).then((res) => {
    data = res;
  });
  return data;
};

export const graphqlExceptionHandler = (error): object => {
  console.log(error);
  const system_error = 'system error (graphql server not running)';
  const federation_response = error?.response?.error
    ? system_error
    : error?.response?.errors[0]?.message;
  const error_response = {
    message: error.type ? system_error : federation_response,
  };
  const error_message = error_response ? error_response : 'server side';
  const error_code: number = error.type ? 500 : error?.response?.status;
  return {
    status: error_code == 200 ? 405 : error_code,
    graphql_error: error_message,
  };
};
