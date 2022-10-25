import { postgresInsertCall } from 'src/utils/postgres/insert';
import { insertMediaQuery } from '../queries/media';

//                       <insert>

export const insertProductMediaById = async (mediaUrl: string, productId) => {
  return await postgresInsertCall(insertMediaQuery(mediaUrl, productId));
};
