import { mssqlCall } from '../bulk-import/fetch';
import { tbSyleNoById } from '../query';

export const fetchStyleDetailsById = async (id: string) => {
  return await mssqlCall(tbSyleNoById(id));
};
