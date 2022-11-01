import { mssqlCall } from 'src/utils/core/mssqlFetch';
import { subCategoryQuery } from '../product.query';

export const getBulkMasterCategoriesData = async (): Promise<any> => {
  return await mssqlCall(subCategoryQuery());
};
