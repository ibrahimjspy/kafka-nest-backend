import { gql } from 'graphql-request';

export const mediaCreateMutation = (productMedia, productId) => {
  return gql`
    mutation{
    productMediaCreate(
    input: {
      product:"${productId}"
      mediaUrl:"${productMedia}"
    }
  ){
    media{
        id
    }
    errors{
      message
      field
    }
  }
} 
`;
};

// {
//     "data": {
//       "productMediaCreate": {
//         "media": {
//           "id": "UHJvZHVjdE1lZGlhOjE="
//         }
//       }
//     }
//   }

// const data = {
//     "productMediaCreate": {
//       "media": {
//         "id": "UHJvZHVjdE1lZGlhOjE="
//       }
//     }
//   }
// const id = productId;
// const mediaUrls = [];

// mediaUrls.map((n) => {
//   productMediaCreate(n, id);
// });
