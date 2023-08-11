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
import { Logger } from '@nestjs/common';

export const fetchBulkSubCategoriesData = async () => {
  return await mssqlCall(subCategoryQuery());
};

export const fetchBulkMasterCategoriesData = async () => {
  return await mssqlCall(masterCategoryQuery());
};

export const fetchBulkProductsData = async (
  vendorId: string,
  filter = true,
) => {
  return await mssqlCall(tbStyleNoNewQuery(vendorId, filter));
};

export const fetchVendor = async (vendorId?: string) => {
  return await mssqlCall(tbVendorQuery(vendorId));
};

export const fetchBulkShippingMethods = async () => {
  return await mssqlCall(tbShipMethodQuery());
};

export const fetchBulkVendorShipping = async (vendorId: number) => {
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
  try {
    let shipsFromData = [] as shipsFromInterface[];
    shipsFromData = (await mssqlCall(
      tbShipsFromQuery(vendorName),
    )) as shipsFromInterface[];
    return {
      minimumAmount: shipsFromData[0]?.InvMinAmount,
      shipsFrom: shipsFromData[0].id,
    };
  } catch (error) {
    Logger.log(error);
    return {
      minimumAmount: 0,
      shipsFrom: 0,
    };
  }
};

export const fetchVendorSettings = async (vendorId: string) => {
  return await mssqlCall(tbVendorSettingsQuery(vendorId));
};
