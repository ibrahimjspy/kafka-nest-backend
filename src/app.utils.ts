import { HttpStatus } from '@nestjs/common';
import { FailedResponseType } from './app.utils.types';

/**
 * validates string length
 */
export const stringValidation = (string: string) => {
  if (string.length > 5) {
    return true;
  }
  return false;
};

/**
 * It returns a failed response object
 * @param {string} [message=Failed.] - The message to be returned to the client.
 * @param {HttpStatus} status - The HTTP status code.
 * @param errors - Array<any> = []
 * @returns An object with a status, message, and errors.
 */
export const prepareFailedResponse = async (
  message = '',
  status: HttpStatus = HttpStatus.BAD_REQUEST,
  errors: Array<any> = [],
): Promise<FailedResponseType> => {
  const response: FailedResponseType = {
    status: status ? status : HttpStatus.BAD_REQUEST,
    message: message ? message : 'Failed.',
  };
  if (errors.length > 0) {
    response['errors'] = errors;
  }
  return response;
};
