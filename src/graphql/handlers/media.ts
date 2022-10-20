import { Logger } from '@nestjs/common';
import { productMediaCreate } from 'src/types/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { mediaCreateMutation } from '../mutations/media/create';

export const createProductMediaHandler = async (
  mediaUrl: string,
  productId: string,
) => {
  try {
    const mediaCreate: productMediaCreate = await graphqlCall(
      mediaCreateMutation(mediaUrl, productId),
    );
    Logger.verbose('media created', mediaCreate);
    const mediaId = mediaCreate.productMediaCreate?.media?.id;
    return mediaId;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
