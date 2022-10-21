//                       <fetch>

export const productIdQuery = (sourceId: string): string => {
  return `
  select
  destination_id
  from cdc.product_id_mapping_table
  where source_id = ${sourceId}
`;
};

//                       <insert>

export const insertProductIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  return `
  INSERT INTO cdc.product_id_mapping_table
  (source_id, destination_id)
  VALUES(${sourceId}, '${destinationId}');
`;
};

//                       <delete>

export const deleteProductIdQuery = (sourceId: string): string => {
  return `
  DELETE FROM cdc.product_id_mapping_table
  WHERE source_id=${sourceId};
`;
};
