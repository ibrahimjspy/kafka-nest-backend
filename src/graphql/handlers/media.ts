import { Logger } from '@nestjs/common';
import { productMediaCreate } from 'src/graphql/types/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/graphql/graphql.utils';
import { mediaCreateMutation } from '../mutations/media/create';

//  <-->  Create  <-->

export const createProductMediaHandler = async (
  mediaUrl: string,
  productId: string,
) => {
  try {
    const mediaCreate: productMediaCreate = await graphqlCall(
      mediaCreateMutation(mediaUrl, productId),
    );
    Logger.verbose('media created');
    const mediaId = mediaCreate.productMediaCreate?.media?.id;
    return mediaId;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
