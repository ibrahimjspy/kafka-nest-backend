import { productMediaCreate } from 'src/types/poduct';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { mediaCreateMutation } from '../mutations/media/create';

export const createProductMedia = async (
  mediaUrl: string,
  productId: string,
) => {
  try {
    const mediaCreate: productMediaCreate = await graphqlCall(
      mediaCreateMutation(mediaUrl, productId),
    );
    const mediaId = mediaCreate.productMediaCreate?.media?.id;
    return mediaId;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const updateProductMedia = async (
  productData: object,
  productId: string,
) => {
  try {
    return await graphqlCall(updateProductMedia(productData, productId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
