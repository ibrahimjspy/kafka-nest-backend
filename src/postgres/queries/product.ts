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
  return `
  insert into cdc.product_id_mapping_table (
      source_id,
      destination_id
  ) values (
      ${sourceId},
      ${destinationId}
  )
`;
};
