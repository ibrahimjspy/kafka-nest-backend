import { Logger } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
type GraphqlCall = (Query: string) => Promise<object>;
/**
 * This is top level function which handles graphql requests , exceptions and logic
 * @params Query ,  It must be in string format and no query based
 * logic should be transferred to graphqlHandler
 * @note This function determines its endpoint logic through another public method graphqlHandler() which
 * is based on env files content .
 * @returns an object with data or graphql error
 */
export const graphqlCall: GraphqlCall = async (Query: string): Promise<any> => {
  let data = {};
  const graphQLClient = new GraphQLClient(
    process.env.DESTINATION_GRAPHQL_ENDPOINT,
  );
  await graphQLClient.request(Query).then((res) => {
    data = res;
  });
  return data;
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
): Promise<any> => {
  let data = {};
  const graphQLClient = new GraphQLClient(
    process.env.DESTINATION_SALEOR_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${process.env.AUTHORIZATION_HEADER_APP}`,
      },
    },
  );
  await graphQLClient.request(Query).then((res) => {
    data = res;
  });
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
  const graphQLClient = new GraphQLClient(
    process.env.DESTINATION_SALEOR_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${Token}`,
      },
    },
  );
  await graphQLClient
    .request(Query)
    .then((res) => {
      data = res;
    })
    .catch((error) => {
      Logger.log(error);
      return graphqlExceptionHandler(error);
    });
  return data;
};
// TODO apply custom error handling taking whole catch thing at functional level
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
  Logger.error(error_message);
  return {
    status: error_code == 200 ? 405 : error_code,
    graphql_error: error_message,
  };
};
