/**
 * @description this utility is for mapping service response parsing.
 * it takes the response as defined by elastic search protocol and returns element value of first object in given array
 * @params -- element you want value for -- type - string
 * @params -- elastic search response array you want that element value from
 */
export const getIdByElement = (element: string, response) => {
  try {
    if (response.length) {
      return response[0][`${element}`]?.raw || null;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * @description this utility is for mapping service response parsing.
 * it takes the response as defined by elastic search protocol and returns array of mappings
 */
export const transformMappingsArray = (
  mappingsArray,
): Array<{
  sourceId: string;
  destinationId: string;
}> => {
  const mappings = [];
  mappingsArray.map((mapping) => {
    mappings.push({
      sourceId: mapping.os_product_id.raw,
      destinationId: mapping.shr_b2b_product_id.raw,
    });
  });
  return mappings;
};
