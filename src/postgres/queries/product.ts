//                       <fetch>

export const productIdQuery = (sourceId: string): string => {
  return `
  select
  destination_id
  from cdc.product_id_mapping_table
  where source_id = '${sourceId}'
`;
};

// fetches serial4 type id by product slug

export const productSerialIdQuery = (slug: string): string => {
  return `
  SELECT id
  FROM saleor.product_product
  WHERE slug='${slug}';
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
  VALUES('${sourceId}', '${destinationId}');
`;
};

//                       <delete>

export const deleteProductIdQuery = (sourceId: string): string => {
  return `
  DELETE FROM cdc.product_id_mapping_table
  WHERE source_id='${sourceId}';
`;
};
