export const masterCategoryIdQuery = (sourceId: string): string => {
  return `
      select
      destination_id
      from cdc.product_category_master_id_mapping
      where source_id = ${sourceId}
    `;
};

export const subCategoryIdQuery = (sourceId: string): string => {
  return `
      select
      destination_id
      from cdc.product_category_sub_id_mapping
      where source_id = ${sourceId}
    `;
};

export const insertMasterCategoryIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  return `
    insert into cdc.product_category_master_id_mapping (
        source_id,
        destination_id
    ) values (
        ${sourceId},
        ${destinationId}
    )
  `;
};

export const insertSubCategoryIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  return `
      insert into cdc.product_category_sub_id_mapping (
          source_id,
          destination_id
      ) values (
          ${sourceId},
          ${destinationId}
      )
    `;
};
