import { request } from 'graphql-request';
type GraphqlCall = (Query: string, Mock?: string) => Promise<object>;
/**
 * This is top level function which handles graphql requests , exceptions and logic
 * @params Query ,  It must be in string format and no query based
 * logic should be transferred to graphqlHandler
 * @params Mock , it is an optional parameter to allow specific functions to call mock server while other
 * keep calling federation services
 * @note This function determines its endpoint logic through another public method graphqlHandler() which
 * is based on env files content .
 * @returns an object with data or graphql error
 */
export const graphqlCall: GraphqlCall = async (Query) => {
  let Data = {};
  await request('http://54.185.167.149:4000/', Query)
    .then((data) => {
      Data = data;
    })
    .catch((error) => {
      Data = graphqlExceptionHandler(error);
    });
  return Data;
};
// TODO apply custom error handling taking whole catch thing at functional level
export const graphqlExceptionHandler = (error): object => {
  const system_error = 'system error (graphql server not running)';
  const federation_response = error?.response?.error
    ? system_error
    : error?.response?.errors[0]?.message;
  const error_response = {
    message: error.type ? system_error : federation_response,
  };
  const error_message = error_response ? error_response : 'server side';
  const error_code: number = error.type ? 500 : error?.response?.status;
  console.log('graphql error', error_message);
  return {
    status: error_code == 200 ? 405 : error_code,
    graphql_error: error_message,
  };
};
