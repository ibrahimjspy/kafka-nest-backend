import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/shop';

export const createUserMutation = (shopData: shopTransformed) => {
  const { name, email, url } = shopData;
  return gql`
      mutation {
        staffCreate(
          input: {
            firstName: "${name}"
            email: "${email}"
            isActive: true
            # addGroups: ["fd"]
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
      tokenCreate(email: "ibrahim@aiworks.ai", password: "123") {
        token
      }
    }
  `;
};
