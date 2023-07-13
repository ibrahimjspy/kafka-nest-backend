import { mssqlCall } from '../bulk-import/fetch';
import { brandViewQuery } from '../query';

export const fetchBrandDetails = async (vendorId: string) => {
  let viewData: any = [];
  viewData = await mssqlCall(brandViewQuery(vendorId));
  return viewData[0];
};
