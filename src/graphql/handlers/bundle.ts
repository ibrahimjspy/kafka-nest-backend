import { Logger } from '@nestjs/common';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import { createBundleMutation } from '../mutations/bundles/create';
import { bundleQueryTransformer } from '../utils/transformers';

//  <-->  Create  <-->

export const createBundleHandler = async (
  bundleVariants,
  bundleQuantities,
  shopId,
  bundleName = 'product variant bundle',
) => {
  try {
    const bundles = await graphqlCall(
      createBundleMutation(
        bundleQueryTransformer(bundleVariants, bundleQuantities),
        shopId,
        bundleName,
      ).replace(/'/g, '"'),
    );
    return bundles;
  } catch (err) {
    Logger.error('add to bundle call failed');
    return graphqlExceptionHandler(err);
  }
};
