import { BrandInterface } from 'src/transformer/types/shop';
import { mssqlCall } from '../bulk-import/fetch';
import { brandViewQuery } from '../query';

export const fetchBrandDetails = async (vendorId: string) => {
  let viewData = [];
  viewData = (await mssqlCall(brandViewQuery(vendorId))) as BrandInterface[];
  return viewData[0] as BrandInterface;
};
