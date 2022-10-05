export const masterCategoryIdQuery = (sourceId: string): string => {
  return `
      select
      destination_id
      from product_id_mapping_table
      where source_id = ${sourceId}
    `;
};

export const subCategoryIdQuery = (sourceId: string): string => {
  return `
      select
      destination_id
      from product_id_mapping_table
      where source_id = ${sourceId}
    `;
};
