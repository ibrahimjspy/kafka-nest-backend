import client from '../config';
import {
  insertMasterCategoryIdQuery,
  insertSubCategoryIdQuery,
  masterCategoryIdQuery,
  subCategoryIdQuery,
} from '../queries/category';

export const fetchMasterCategoryId = async (sourceId: string) => {
  let id = '';
  await client.query(masterCategoryIdQuery(sourceId), (err, res) => {
    if (err) throw err;
    id = res.rows[0].destination_id;
  });
  return id;
};

export const fetchSubCategoryId = async (sourceId: string) => {
  let id = '';
  await client.query(subCategoryIdQuery(sourceId), (err, res) => {
    if (err) throw err;
    id = res.rows[0].destination_id;
    console.log(id, 'sub category id');
  });
  return id;
};

export const insertMasterCategoryId = async (
  sourceId: string,
  destinationId: string,
) => {
  await client.query(
    insertMasterCategoryIdQuery(sourceId, destinationId),
    (err, res) => {
      if (err) throw err;
      console.log(res.rows);
    },
  );
  return 'run';
};

export const insertSubCategoryId = async (
  sourceId: string,
  destinationId: string,
) => {
  await client.query(
    insertSubCategoryIdQuery(sourceId, destinationId),
    (err, res) => {
      if (err) throw err;
      console.log(res.rows);
    },
  );
  return 'run';
};
