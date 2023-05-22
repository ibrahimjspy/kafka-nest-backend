import { Logger } from '@nestjs/common';
import { mssqlCall } from '../bulk-import/fetch';
import { tbSyleNoById } from '../query';

export const fetchStyleDetailsById = async (id: string) => {
  try {
    let productData: any = [];
    productData = await mssqlCall(tbSyleNoById(id));
    return productData[0];
  } catch (error) {
    Logger.error('no product matches criteria', error);
    return null;
  }
};
