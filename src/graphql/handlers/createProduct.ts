import {request} from 'graphql-request';
import {createProductCatalogQuery} from '../queries/createProduct';

export const createProductCatalog = async (productData) => {
  let Data = {};
  // !. Graphql api call
  await request('localhost:4030', createProductCatalogQuery(productData))
      .then((data) => {
        Data = data;
      })
      .catch((error) => {
        console.log(error);
      });
  return Data;
};
