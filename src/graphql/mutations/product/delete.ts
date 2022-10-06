import { gql } from 'graphql-request';

export const deleteProductMutation = (productData) => {
  const productId = productData.TBItem_ID;
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
