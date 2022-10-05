export const ProductIdQuery = (sourceId: string): string => {
  return `
    select
    destination_id
    from product_id_mapping_table
    where source_id = ${sourceId}
  `;
};

export const insertProductIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  return `
  insert into product_id_mapping_table (
      source_id
      destination-id
  ) values (
      ${sourceId}
      ${destinationId}
  )
`;
};
