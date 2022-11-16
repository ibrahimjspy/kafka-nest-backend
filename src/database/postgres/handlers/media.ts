import { postgresInsertCall } from 'src/database/postgres/call/insert';
import { insertMediaQuery } from '../queries/media';

//                       <insert>

export const insertProductMediaById = async (mediaUrl: string, productId) => {
  return await postgresInsertCall(insertMediaQuery(mediaUrl, productId));
};
