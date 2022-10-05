import client from '../config';
import { masterCategoryIdQuery, subCategoryIdQuery } from '../queries/category';

export const fetchMasterCategoryId = async (
  sourceId: string,
): Promise<string> => {
  await client.query(masterCategoryIdQuery(sourceId), (err, res) => {
    if (err) throw err;
    console.log(res.rows);
  });
  return 'run';
};

export const fetchSubCategoryId = async (sourceId: string): Promise<string> => {
  await client.query(subCategoryIdQuery(sourceId), (err, res) => {
    if (err) throw err;
    console.log(res.rows);
  });
  return 'run';
};
