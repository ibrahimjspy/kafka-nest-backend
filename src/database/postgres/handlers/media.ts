import { postgresInsertCall } from 'src/database/postgres/call/insert';
import { postgresFetchMediaIdCall } from '../call/fetch';
import {
  fetchMediaIdQuery,
  insertMediaQuery,
  insertThumbnailQuery,
  insertVariantMediaQuery,
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

export const insertVariantMedia = async (mediaId: string, productVariantId) => {
  return await postgresInsertCall(
    insertVariantMediaQuery(mediaId, productVariantId),
  );
};

//                       <fetch>

export const fetchProductMediaId = async (mediaUrl: string, productId) => {
  return await postgresFetchMediaIdCall(fetchMediaIdQuery(mediaUrl, productId));
};
