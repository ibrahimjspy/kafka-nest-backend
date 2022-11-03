import { deleteProductHandler } from 'src/graphql/handlers/product';
import { deleteProductByDestinationId } from 'src/postgres/handlers/product';

export const productDeleteById = async (destinationId): Promise<object> => {
  if (destinationId) {
    const productDelete = await deleteProductHandler(destinationId);
    const productIdDelete = await deleteProductByDestinationId(destinationId);
    return { productDelete, productIdDelete };
  }
};
