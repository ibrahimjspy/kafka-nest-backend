/* eslint-disable @typescript-eslint/no-unused-vars */
import { request } from 'graphql-request';
import { createProductCatalogQuery } from '../queries/createProduct';

export const createProductCatalog = async (productData) => {
  let Data = {};
  // !. Graphql api call
  await request(
    'http://54.185.167.149:4000/',
    createProductCatalogQuery(productData),
  )
    .then((data) => {
      Data = data;
    })
    .catch((error) => {
      console.log('graphql method was called');
    });
  return Data;
};
