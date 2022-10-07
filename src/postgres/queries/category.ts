//                       <fetch>

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

//                       <insert>

export const insertMasterCategoryIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  return `
  INSERT INTO cdc.product_category_master_id_mapping
  (source_id, destination_id)
  VALUES(${sourceId}, '${destinationId}');
  `;
};

export const insertSubCategoryIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  return `
  INSERT INTO cdc.product_category_sub_id_mapping
  (source_id, destination_id)
  VALUES(${sourceId}, '${destinationId}');
    `;
};

//                       <delete>

export const deleteSubCategoryIdQuery = (sourceId: string): string => {
  return `
  DELETE FROM cdc.product_category_sub_id_mapping
  WHERE source_id=${sourceId};
    `;
};

export const deleteMasterCategoryIdQuery = (sourceId: string): string => {
  return `
  DELETE FROM cdc.product_category_master_id_mapping
  WHERE source_id=${sourceId};
    `;
};
