import { Logger } from '@nestjs/common';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { createBundleMutation } from '../mutations/bundles/create';

//  <-->  Create  <-->

export const createBundleHandler = async (
  bundleVariants: string,
  shopId: string,
) => {
  try {
    const bundles = await graphqlCall(
      createBundleMutation(bundleVariants, shopId).replace(/'/g, '"'),
    );
    Logger.verbose('Bundle created', bundles);
    return bundles;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
