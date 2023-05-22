import { mssqlCall } from '../bulk-import/fetch';
import { TBStyleSearchUniqueQuery } from '../query';

export const getProductDetailsFromDb = async (productId) => {
  let viewData: any = [];
  viewData = await mssqlCall(TBStyleSearchUniqueQuery(productId));
  return viewData[0];
};
