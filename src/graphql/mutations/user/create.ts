import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/transformers/shop';
import * as dotenv from 'dotenv';
dotenv.config();

export const createUserMutation = (shopData: shopTransformed) => {
  const { name, email, url } = shopData;
  return gql`
      mutation {
        staffCreate(
          input: {
            firstName: "${name}"
            email: "${email}"
            isActive: true
            addGroups: ["R3JvdXA6MQ=="]
            redirectUrl: "${url}"
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
