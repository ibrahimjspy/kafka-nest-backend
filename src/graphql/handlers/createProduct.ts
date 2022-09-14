import { request } from 'graphql-request';
import { createProductQuery } from '../queries/createProduct';

export const createProduct = async (productData) => {
  let Data = {};
  await request('localhost:4030', createProductQuery(productData))
    .then((data) => {
      Data = data;
    })
    .catch((error) => {
      console.log(error);
    });
  return Data;
};
