import { Logger } from '@nestjs/common';
import { postgresDeleteCall } from 'src/utils/postgres/delete';
import { postgresFetchIdCall } from 'src/utils/postgres/fetch';
import { postgresInsertCall } from 'src/utils/postgres/insert';
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
  return await postgresFetchIdCall(masterCategoryIdQuery(sourceId));
};

export const fetchSubCategoryId = async (
  sourceId: string,
  sourceMasterId: string,
) => {
  return await postgresFetchIdCall(
    subCategoryIdQuery(sourceId, sourceMasterId),
  );
};

//                       <insert>

export const insertMasterCategoryId = async (
  sourceId: string,
  destinationId,
) => {
  try {
    if (destinationId.categoryCreate.category.id) {
      return await postgresInsertCall(
        insertMasterCategoryIdQuery(
          sourceId,
          destinationId?.categoryCreate?.category?.id,
        ),
      );
    }
  } catch (error) {
    Logger.log('error');
  }
};

export const insertSubCategoryId = async (
  sourceId: string,
  destinationId,
  sourceMasterId,
) => {
  try {
    if (destinationId.categoryCreate.category.id) {
      return await postgresInsertCall(
        insertSubCategoryIdQuery(
          sourceId,
          destinationId?.categoryCreate?.category?.id,
          sourceMasterId,
        ),
      );
    }
  } catch (error) {}
};

//                       <delete>

export const deleteMasterCategoryId = async (destinationId) => {
  return await postgresDeleteCall(deleteMasterCategoryIdQuery(destinationId));
};

export const deleteSubCategoryId = async (destinationId) => {
  return await postgresDeleteCall(deleteSubCategoryIdQuery(destinationId));
};
