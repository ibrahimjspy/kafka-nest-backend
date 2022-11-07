import { Logger } from '@nestjs/common';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { createBundleMutation } from '../mutations/bundles/create';

//  <-->  Create  <-->

export const createBundleHandler = async (
  bundleVariants,
  bundleQuantities,
  shopId,
  retry = 0,
) => {
  try {
    if (retry !== 0) {
      Logger.warn(`${retry} retry in create bundles call`, {
        bundleVariants,
      });
    }

    const bundles = await graphqlCall(
      createBundleMutation(bundleVariants, bundleQuantities, shopId).replace(
        /'/g,
        '"',
      ),
    );
    Logger.verbose('Bundle created', bundles);
    return bundles;
  } catch (err) {
    if (retry) {
      return graphqlExceptionHandler(err);
    }
    return await createBundleHandler(bundleVariants, shopId, retry + 1);
  }
};
