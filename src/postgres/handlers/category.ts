import { postgresDeleteCall } from 'src/utils/postgres/delete';
import { postgresFetchCall } from 'src/utils/postgres/fetch';
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
  return await postgresFetchCall(masterCategoryIdQuery(sourceId));
};

export const fetchSubCategoryId = async (sourceId: string) => {
  return await postgresFetchCall(subCategoryIdQuery(sourceId));
};

//                       <insert>

export const insertMasterCategoryId = async (
  sourceId: string,
  destinationId,
) => {
  return await postgresInsertCall(
    insertMasterCategoryIdQuery(
      sourceId,
      destinationId?.categoryCreate?.category?.id,
    ),
  );
};

export const insertSubCategoryId = async (sourceId: string, destinationId) => {
  return await postgresDeleteCall(
    insertSubCategoryIdQuery(
      sourceId,
      destinationId?.categoryCreate?.category?.id,
    ),
  );
};

//                       <delete>

export const deleteMasterCategoryId = async (destinationId) => {
  return await postgresDeleteCall(deleteMasterCategoryIdQuery(destinationId));
};

export const deleteSubCategoryId = async (destinationId) => {
  return await postgresDeleteCall(deleteSubCategoryIdQuery(destinationId));
};
