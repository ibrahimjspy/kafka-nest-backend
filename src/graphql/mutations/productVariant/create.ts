import { gql } from 'graphql-request';

export const createProductMutation = (productData) => {
  console.log(productData);
  // parsing product data;
  // const testProductType = "UHJvZHVjdFR5cGU6MQ=="
  //   const { name, description } = productData;
  return gql`
    mutation {
      productVariantCreate(
        input: {
          attributes: { id: "QXR0cmlidXRlOjE=", values: ["Red"] }
          product: "UHJvZHVjdDoyNA=="
        }
      ) {
        productVariant {
          id
          name
        }
        errors {
          message
        }
      }
    }
  `;
};
