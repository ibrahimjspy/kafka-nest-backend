//                       <fetch>

export const shippingMethodIdQuery = (sourceId: string): string => {
  return `
    SELECT id, source_id, destination_id
    FROM cdc.shipping_method_mapping
    where source_id = '${sourceId}'
    `;
};

//                       <insert>

export const insertShippingIdQuery = (
  sourceId: string,
  destinationId,
): string => {
  return `
  INSERT INTO cdc.shipping_method_mapping
  (source_id, destination_id)
  VALUES('${sourceId}', '${destinationId}');
    `;
};
