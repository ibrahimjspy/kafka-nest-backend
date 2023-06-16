import { mssqlCall } from 'src/database/mssql/bulk-import/fetch';
import {
  masterCategoryQuery,
  subCategoryQuery,
  tbCustomerQuery,
  tbShipMethodQuery,
  tbShipsFromQuery,
  tbStyleFirstTenQuery,
  tbStyleNoNewQuery,
  tbVendorQuery,
  tbVendorSettingsQuery,
  tbVendorShippingDetailsQuery,
} from '../query';
import { shipsFromInterface } from '../types/product';

export const fetchBulkSubCategoriesData = async () => {
  return await mssqlCall(subCategoryQuery());
};

export const fetchBulkMasterCategoriesData = async () => {
  return await mssqlCall(masterCategoryQuery());
};

export const fetchBulkProductsData = async (vendorId: string) => {
  return await mssqlCall(tbStyleNoNewQuery(vendorId));
};

export const fetchVendor = async (vendorId?) => {
  return await mssqlCall(tbVendorQuery(vendorId));
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

/**
 * @description -- this method takes in vendorName and returns vendor minimum order amount from os tb ships from table
 */
export const fetchVendorMinimumOrderAmount = async (vendorName: string) => {
  let shipsFromData = [] as shipsFromInterface[];
  shipsFromData = (await mssqlCall(
    tbShipsFromQuery(vendorName),
  )) as shipsFromInterface[];
  return shipsFromData[0].InvMinAmount || 0;
};

export const fetchVendorSettings = async (vendorId: string) => {
  return await mssqlCall(tbVendorSettingsQuery(vendorId));
};
