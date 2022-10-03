import { gql } from 'graphql-request';

export const deleteProductMutation = (productId: string) => {
  return gql`
    mutation{
    productDelete(id:"${productId}"){
        product{
        name
        }
    }
    }
`;
};
