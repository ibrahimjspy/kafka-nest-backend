import { mssqlCall } from 'src/utils/core/mssqlFetch';
import { masterCategoryQuery } from '../product.query';

export const getBulkSubCategoriesData = async (): Promise<any> => {
  return await mssqlCall(masterCategoryQuery());
};
