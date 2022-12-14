import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, Logger, Param } from '@nestjs/common';
import { shopTransformed } from 'src/transformer/types/shop';
import { awsClient } from './client';

@Injectable()
export class UserService {
  public async create(@Param() user: shopTransformed): Promise<any> {
    try {
      const { AWS_USER_POOL_ID } = process.env;
      const { name, email, phoneNumber } = user;
      const command = new AdminCreateUserCommand({
        UserPoolId: AWS_USER_POOL_ID,
        Username: `${email}`,
        UserAttributes: [
          { Name: 'email', Value: `${email}` },
          { Name: 'family_name', Value: `${name}` },
          { Name: 'given_name', Value: `${name}` },
          { Name: 'phone_number', Value: `${phoneNumber}` },
        ],
        MessageAction: 'SUPPRESS',
      });
      const response = await awsClient.send(command);
      Logger.verbose('user created', response);
      return email;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async delete(@Param() user: shopTransformed): Promise<any> {
    console.log(user.email);
    try {
      const { AWS_USER_POOL_ID } = process.env;
      const command = new AdminDeleteUserCommand({
        Username: user.email,
        UserPoolId: AWS_USER_POOL_ID,
      });
      const response = await awsClient.send(command);
      Logger.warn('user deleted', response);
    } catch (error) {
      console.log(error);
    }
  }
}
