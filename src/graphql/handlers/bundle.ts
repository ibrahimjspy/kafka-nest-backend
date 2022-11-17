import { Logger } from '@nestjs/common';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/graphql/graphql.utils';
import { createBundleMutation } from '../mutations/bundles/create';

//  <-->  Create  <-->

export const createBundleHandler = async (
  bundleVariants,
  bundleQuantities,
  shopId,
) => {
  try {
    const bundles = await graphqlCall(
      createBundleMutation(bundleVariants, bundleQuantities, shopId).replace(
        /'/g,
        '"',
      ),
    );
    return bundles;
  } catch (err) {
    Logger.error('add to bundle call failed');
    return graphqlExceptionHandler(err);
  }
};
