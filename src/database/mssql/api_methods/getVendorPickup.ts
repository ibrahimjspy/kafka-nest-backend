import { mssqlCall } from '../bulk-import/fetch';
import { tbVendorSettingsQuery } from '../query';

export const fetchVendorPickupById = async (id: string) => {
  return await mssqlCall(tbVendorSettingsQuery(id));
};
