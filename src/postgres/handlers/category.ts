import { Logger } from '@nestjs/common';
import client from '../config';
import {
  insertMasterCategoryIdQuery,
  insertSubCategoryIdQuery,
  masterCategoryIdQuery,
  subCategoryIdQuery,
} from '../queries/category';

export const fetchMasterCategoryId = async (sourceId: string) => {
  let id = '';
  await client.query(masterCategoryIdQuery(sourceId), [], (err, res) => {
    if (err) {
      Logger.warn(err);
    } else {
      Logger.log('DATA:', res.rows[0]);
      id = res.rows[0]?.destination_id;
    }
    // client.end();
  });
  return id;
};

export const fetchSubCategoryId = async (sourceId: string) => {
  let id = '';
  await client.query(subCategoryIdQuery(sourceId), [], (err, res) => {
    if (err) {
      Logger.warn(err);
    } else {
      Logger.log('DATA:', res.rows[0]);
      id = res.rows[0]?.destination_id;
    }
    // client.end();
  });
  return id;
};

export const insertMasterCategoryId = async (
  sourceId: string,
  destinationId,
) => {
  await client
    .query(
      insertMasterCategoryIdQuery(
        sourceId,
        destinationId.categoryCreate.category.id,
      ),
      [],
    )
    .then((res) => {
      Logger.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'master category register finished';
};

export const insertSubCategoryId = async (sourceId: string, destinationId) => {
  await client
    .query(
      insertSubCategoryIdQuery(
        sourceId,
        destinationId.categoryCreate.category.id,
      ),
      [],
    )
    .then((res) => {
      Logger.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'sub category task finished';
};
