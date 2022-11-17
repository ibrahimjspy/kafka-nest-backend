import { deleteProductHandler } from 'src/graphql/handlers/product';
import { deleteProductByDestinationId } from 'src/database/postgres/handlers/product';

export const productDeleteById = async (destinationId): Promise<object> => {
  if (destinationId) {
    const productDelete = await deleteProductHandler(destinationId);
    const productIdDelete = await deleteProductByDestinationId(destinationId);
    return { productDelete, productIdDelete };
  }
};

// convert array into smaller chunks  [ab, bc, cd] =>  [[ab,bc],[cd]]
export const chunkArray = (arr, size) =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];
