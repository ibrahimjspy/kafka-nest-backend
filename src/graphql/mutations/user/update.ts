import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/transformers/shop';

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
            # addGroups: ["fd"]
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
