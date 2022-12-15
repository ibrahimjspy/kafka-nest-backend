import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, Logger, Param } from '@nestjs/common';
import { shopTransformed } from 'src/transformer/types/shop';
import { awsClient } from './proxies/client';
import { userGroupsRetailer, userGroupsVendor } from './proxies/groups';

@Injectable()
export class UserService {
  constructor(private readonly logger: Logger) {}
  public async create(@Param() user: shopTransformed) {
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
      this.logger.verbose('user created', response);
      return email;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async delete(@Param() user: shopTransformed) {
    try {
      const { AWS_USER_POOL_ID } = process.env;
      const command = new AdminDeleteUserCommand({
        Username: user.email,
        UserPoolId: AWS_USER_POOL_ID,
      });
      const response = await awsClient.send(command);
      this.logger.warn('user deleted', response);
    } catch (error) {
      console.log(error);
    }
  }

  public async addVendorToGroups(@Param() user: shopTransformed) {
    try {
      const { email } = user;
      const { AWS_USER_POOL_ID } = process.env;
      userGroupsVendor.map(async (group) => {
        const addUserToGroup = new AdminAddUserToGroupCommand({
          Username: `${email}`,
          UserPoolId: AWS_USER_POOL_ID,
          GroupName: group,
        });
        await awsClient.send(addUserToGroup);
      });
      this.logger.log('user added to group');
    } catch (error) {
      console.log(error);
    }
  }
  public async addRetailerToGroups(@Param() user: shopTransformed) {
    try {
      const { email } = user;
      const { AWS_USER_POOL_ID } = process.env;
      userGroupsRetailer.map(async (group) => {
        const addUserToGroup = new AdminAddUserToGroupCommand({
          Username: `${email}`,
          UserPoolId: AWS_USER_POOL_ID,
          GroupName: group,
        });
        await awsClient.send(addUserToGroup);
      });
      this.logger.log('user added to group');
    } catch (error) {
      console.log(error);
    }
  }
}
