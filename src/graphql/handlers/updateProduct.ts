import { request } from 'graphql-request';
import { updateProductQuery } from '../queries/updateProduct';

export const updateProduct = async (productUpdateData) => {
  let Data = {};
  await request('localhost:4030', updateProductQuery(productUpdateData))
    .then((data) => {
      Data = data;
    })
    .catch((error) => {
      console.log(error);
    });
  return Data;
};
