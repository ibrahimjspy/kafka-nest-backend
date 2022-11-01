import { mssqlCall } from 'src/utils/core/mssqlFetch';
import { tbStyleNoQuery } from '../product.query';

export const getBulkProductsData = async (): Promise<any> => {
  return await mssqlCall(tbStyleNoQuery());
};
