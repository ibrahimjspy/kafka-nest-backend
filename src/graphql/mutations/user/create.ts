import { gql } from 'graphql-request';
import { shopTransformed } from 'src/transformer/types/shop';
import * as dotenv from 'dotenv';
dotenv.config();

export const createUserMutation = (shopData: shopTransformed) => {
  const { name, email, url } = shopData;
  const GROUP_ID = process.env.DEFAULT_GROUP_ID || 'R3JvdXA6MQ==';
  return gql`
      mutation {
        staffCreate(
          input: {
            firstName: "${name}"
            email: "${email}"
            isActive: true
            addGroups: ["${GROUP_ID}"]
            # redirectUrl: "${url}"
          }
        ) {
          user {
            id
          }
          errors {
            message
            code
            field
          }
        }
      }
    `;
};

export const createSessionToken = () => {
  return gql`
    mutation {
      tokenCreate(email: "${process.env.DESTINATION_SUPERUSER_EMAIL}", password: "${process.env.DESTINATION_SUPERUSER_PASSWORD}") {
        token
      }
    }
  `;
};
