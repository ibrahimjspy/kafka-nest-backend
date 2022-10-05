import client from '../config';

import { insertProductIdQuery, productIdQuery } from '../queries/product';

export const fetchProductId = async (sourceId: string): Promise<string> => {
  let id = '';
  await client.query(productIdQuery(sourceId), (err, res) => {
    if (err) throw err;
    id = res.rows[0].destination_id;
  });
  return id;
};

export const insertProductId = async (
  sourceId: string,
  destinationId: string,
): Promise<string> => {
  await client.query(
    insertProductIdQuery(sourceId, destinationId),
    (err, res) => {
      if (err) throw err;
      console.log(res.rows);
    },
  );
  return 'run';
};
