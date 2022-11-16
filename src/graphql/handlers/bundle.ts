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
  retry = 0,
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
    if (retry > 4) {
      Logger.error('add to bundle call failed');
      return graphqlExceptionHandler(err);
    }
    Logger.warn(`${retry + 1} retry in create bundles call`, {
      bundleVariants,
    });
    return await createBundleHandler(bundleVariants, shopId, retry + 1);
  }
};
