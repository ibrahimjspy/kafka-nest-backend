//                       <fetch>

export const shopIdQuery = (sourceId: string): string => {
  return `
    select
    destination_id
    from cdc.shop_id_mapping_table
    where source_id = ${sourceId}
  `;
};

//                       <insert>

export const insertShopIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  console.log(destinationId);
  return `
    INSERT INTO cdc.shop_id_mapping_table
    (source_id, destination_id)
    VALUES(${sourceId}, '${destinationId}');
  `;
};

//                       <delete>

export const deleteShopIdQuery = (sourceId: string): string => {
  return `
    DELETE FROM cdc.shop_id_mapping_table
    WHERE source_id=${sourceId};
  `;
};
