import { Logger } from '@nestjs/common';
import client from '../config';
import {
  deleteMasterCategoryIdQuery,
  deleteSubCategoryIdQuery,
  insertMasterCategoryIdQuery,
  insertSubCategoryIdQuery,
  masterCategoryIdQuery,
  subCategoryIdQuery,
} from '../queries/category';

//                       <fetch>

export const fetchMasterCategoryId = async (sourceId: string) => {
  let id = '';
  await client
    .query(masterCategoryIdQuery(sourceId), [])
    .then((res) => {
      console.log(res);
      id = res.rows[0]?.destination_id;
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return id;
};

export const fetchSubCategoryId = async (sourceId: string) => {
  let id = '';
  await client
    .query(subCategoryIdQuery(sourceId), [])
    .then((res) => {
      console.log(res);
      id = res.rows[0]?.destination_id;
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return id;
};

//                       <insert>

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
      console.log(res);
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
      console.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'sub category task finished';
};

//                       <delete>

export const deleteMasterCategoryId = async (destinationId) => {
  // console.log(destinationId.productCreate.errors);
  await client
    .query(deleteMasterCategoryIdQuery(destinationId), [])
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'category deleted';
};

export const deleteSubCategoryId = async (destinationId) => {
  // console.log(destinationId.productCreate.errors);
  await client
    .query(deleteSubCategoryIdQuery(destinationId), [])
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      Logger.warn('postgres error', err);
    });
  return 'category deleted';
};
