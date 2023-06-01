import { Logger } from '@nestjs/common';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import { createBundleMutation } from '../mutations/bundles/create';
import { bundleQueryTransformer } from '../utils/transformers';
import { getBundleIdsQuery } from '../queries/bundles';
import { updateBundlePricingMutation } from '../mutations/bundles/update';
import { removeProductMapping } from 'src/mapping/methods/product';
import { deleteProductHandler } from './product';

//  <-->  Create  <-->

export const createBundleHandler = async (
  bundleVariants: string[],
  bundleQuantities: string[],
  shopId: string,
  productId: string,
  bundleName = 'product variant bundle',
) => {
  try {
    const bundles = await graphqlCall(
      createBundleMutation(
        bundleQueryTransformer(bundleVariants, bundleQuantities),
        shopId,
        bundleName,
        productId,
      ).replace(/'/g, '"'),
    );
    return bundles;
  } catch (err) {
    Logger.error('add to bundle call failed');
    await deleteProductHandler(productId); // rollback <api>
    await removeProductMapping(productId); // rollback <mapping>
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Get  <-->

export const getBundleIdsHandler = async (productId: string) => {
  try {
    const bundleIds = [];
    const response: any = await graphqlCall(getBundleIdsQuery(productId));
    response?.bundles?.edges.map((bundle) => {
      bundleIds.push(bundle.node.id);
    });
    return bundleIds;
  } catch (err) {
    Logger.error('get bundles call failed');
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Update  <-->

export const updateBundlePriceHandler = async (bundleIds: string[]) => {
  try {
    return await graphqlCall(updateBundlePricingMutation(bundleIds));
  } catch (err) {
    Logger.error('updating bundle pricing call failed call failed');
    return graphqlExceptionHandler(err);
  }
};
