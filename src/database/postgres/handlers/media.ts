import { postgresInsertCall } from 'src/database/postgres/call/insert';
import { postgresFetchMediaIdCall } from '../call/fetch';
import {
  fetchMediaIdQuery,
  insertMediaQuery,
  insertThumbnailQuery,
} from '../queries/media';
import { thumbnailDto } from '../types/thumbnail';

//                       <insert>

export const insertProductMediaById = async (mediaUrl: string, productId) => {
  return await postgresInsertCall(insertMediaQuery(mediaUrl, productId));
};

export const insertThumbnailMediaById = async (
  thumbnailMedia: thumbnailDto,
) => {
  return await postgresInsertCall(insertThumbnailQuery(thumbnailMedia));
};

//                       <fetch>

export const fetchProductMediaId = async (mediaUrl: string, productId) => {
  return await postgresFetchMediaIdCall(fetchMediaIdQuery(mediaUrl, productId));
};
