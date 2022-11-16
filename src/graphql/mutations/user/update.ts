import { gql } from 'graphql-request';
import { shopTransformed } from 'src/transformer/types/shop';

export const updateUserMutation = (
  shopData: shopTransformed,
  shopId: string,
) => {
  const { name, email, url } = shopData;
  return gql`
      mutation {
        staffUpdate(
          id:"${shopId}"
          input: {
            firstName: "${name}"
            email: "${email}"
            isActive: true
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
