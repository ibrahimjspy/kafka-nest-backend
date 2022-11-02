import { mssqlCall } from 'src/utils/core/mssqlFetch';
import { tbVendorQuery } from '../product.query';

export const getBulkVendors = async (): Promise<any> => {
  return await mssqlCall(tbVendorQuery());
};
