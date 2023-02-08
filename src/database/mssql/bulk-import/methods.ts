import { mssqlCall } from 'src/database/mssql/bulk-import/fetch';
import {
  masterCategoryQuery,
  subCategoryQuery,
  tbCustomerQuery,
  tbShipMethodQuery,
  tbStyleFirstTenQuery,
  tbStyleNoNewQuery,
  tbVendorQuery,
  tbVendorShippingDetailsQuery,
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

export const fetchBulkVendorShipping = async (vendorId: string) => {
  return await mssqlCall(tbVendorShippingDetailsQuery(vendorId));
};

export const fetchBulkCustomers = async () => {
  return await mssqlCall(tbCustomerQuery());
};

export const fetchFirstTenProducts = async () => {
  return await mssqlCall(tbStyleFirstTenQuery());
};
