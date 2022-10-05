import client from '../config';

import { insertProductIdQuery, ProductIdQuery } from '../queries/product';

export const fetchProductId = async (sourceId: string) => {
  await client.query(ProductIdQuery(sourceId), (err, res) => {
    if (err) throw err;
    console.log(res.rows);
  });
  return 'res';
};

export const InsertProductId = async (
  sourceId: string,
  destinationId: string,
) => {
  await client.query(
    insertProductIdQuery(sourceId, destinationId),
    (err, res) => {
      if (err) throw err;
      console.log(res.rows);
    },
  );
  return 'run';
};
