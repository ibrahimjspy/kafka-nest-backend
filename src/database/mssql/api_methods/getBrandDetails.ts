import { BrandInterface } from 'src/transformer/types/shop';
import { mssqlCall } from '../bulk-import/fetch';
import { brandViewQuery } from '../query';
import { Logger } from '@nestjs/common';

export const fetchBrandDetails = async (vendorId: string) => {
  try {
    let viewData = [];
    viewData = (await mssqlCall(brandViewQuery(vendorId))) as BrandInterface[];
    return viewData[0] as BrandInterface;
  } catch (error) {
    Logger.error(error);
    return null;
  }
};
