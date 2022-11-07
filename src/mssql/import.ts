import { mssqlCall } from 'src/utils/core/mssqlFetch';
import {
  masterCategoryQuery,
  subCategoryQuery,
  tbStyleNoNewQuery,
  tbVendorQuery,
} from './query';

export const fetchBulkSubCategoriesData = async () => {
  return await mssqlCall(subCategoryQuery());
};

export const fetchBulkMasterCategoriesData = async () => {
  return await mssqlCall(masterCategoryQuery());
};

export const fetchBulkProductsData = async () => {
  return await mssqlCall(tbStyleNoNewQuery());
};

export const fetchBulkVendors = async () => {
  return await mssqlCall(tbVendorQuery());
};
