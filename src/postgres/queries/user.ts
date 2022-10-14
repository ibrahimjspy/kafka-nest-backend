//                       <fetch>

export const userIdQuery = (sourceId: string): string => {
  return `
      select
      destination_id
      from cdc.user_id_mapping_table
      where source_id = ${sourceId}
    `;
};

//                       <insert>

export const insertUserIdQuery = (
  sourceId: string,
  destinationId: string,
): string => {
  console.log(destinationId);
  return `
      INSERT INTO cdc.user_id_mapping_table
      (source_id, destination_id)
      VALUES(${sourceId}, '${destinationId}');
    `;
};

//                       <delete>

export const deleteUserIdQuery = (sourceId: string): string => {
  return `
      DELETE FROM cdc.user_id_mapping_table
      WHERE source_id=${sourceId};
    `;
};
