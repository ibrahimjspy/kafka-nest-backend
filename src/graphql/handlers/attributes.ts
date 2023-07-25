import { Logger } from '@nestjs/common';
import { getAttributesQuery } from '../queries/attributes';
import { graphqlCall, graphqlExceptionHandler } from '../utils/call';

export const getAttributesHandler = async () => {
  try {
    Logger.log('fetching attributes');
    const response = await graphqlCall(getAttributesQuery());
    return response['attributes'];
  } catch (err) {
    Logger.warn('Attributes fetch call failed', graphqlExceptionHandler(err));
    throw err;
  }
};
