import { request } from 'graphql-request';
import { updateProductQuery } from '../queries/updateProduct';

export const updateProduct = async (productUpdateData) => {
  let Data = {};
  // !. Graphql api call
  await request(
    'http://54.185.167.149:4000/',
    updateProductQuery(productUpdateData),
  )
    .then((data) => {
      Data = data;
    })
    .catch((error) => {
      console.log(error);
    });
  return Data;
};
