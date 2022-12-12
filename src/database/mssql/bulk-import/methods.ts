import { mssqlCall } from 'src/database/mssql/bulk-import/fetch';
import {
  masterCategoryQuery,
  subCategoryQuery,
  tbShipMethodQuery,
  tbStyleNoNewQuery,
  tbVendorQuery,
} from '../query';

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

export const fetchBulkShippingMethods = async () => {
  return await mssqlCall(tbShipMethodQuery());
};
