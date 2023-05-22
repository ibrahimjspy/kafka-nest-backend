import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const ctxResponse = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const response: any = exception.getResponse();
    let data = response;
    if (typeof response !== 'string' && Array.isArray(response.message)) {
      data = {
        message: response.message[0],
      };
    }

    ctxResponse.status(status).json(data);
  }
}
