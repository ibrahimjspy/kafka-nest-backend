export const productIdQuery = (sourceId: string): string => {
  return `
  select
  destination_id
  from cdc.product_id_mapping_table
  where source_id = ${sourceId}
`;
};

export const insertProductIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  console.log(destinationId);
  return `
  INSERT INTO cdc.product_id_mapping_table
  (source_id, destination_id)
  VALUES(${sourceId}, '${destinationId}');
`;
};
