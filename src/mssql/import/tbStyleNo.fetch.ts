import { mssqlCall } from 'src/utils/core/mssqlFetch';
import { tbStyleNoNewQuery } from '../product.query';

export const getBulkProductsData = async (): Promise<any> => {
  return await mssqlCall(tbStyleNoNewQuery());
};
