import { Injectable } from '@nestjs/common';
import { masterCategoryTransformerMethod } from 'src/services/transformer/methods/category/master';
import { subCategoryTransformerMethod } from 'src/services/transformer/methods/category/sub';
import { productGeneralTransformerMethod } from 'src/services/transformer/methods/product/general';
import { shopTransformerMethod } from './methods/shop/general';
/**
 * Transformation class with utility methods performing specific
 *  transformations on product Object and its utilities
 * @params CDC object to transform and validate
 */
@Injectable()
export class TransformerService {
  /**
   * complete product object transform
   * @params productObject
   */
  public productTransformer(productObject) {
    this.masterCategoryTransformer(productObject);
    this.productMediaTransformer(productObject);
    this.reviewsTransformer(productObject);
    this.pricingTransformer(productObject);
    this.generalTransformer(productObject);
    return productObject;
  }
  /**
   * master category transform and validate
   * @returns category object ready to be mapped against Api interface
   */
  public masterCategoryTransformer(categoryObject) {
    return masterCategoryTransformerMethod(categoryObject);
  }
  /**
   * sub category transform and validate
   * @returns category object ready to be mapped against Api interface
   */
  public subCategoryTransformer(categoryObject) {
    return subCategoryTransformerMethod(categoryObject);
  }
  /**
   * product details transform and validate
   * name, description, category
   * @returns product information object ready to be mapped against Api interface
   */
  public generalTransformer(productObject) {
    return productGeneralTransformerMethod(productObject);
  }
  /**
   * shop transform and validate
   * @returns shop object ready to be mapped against Api interface
   */
  public shopTransformer(shopObject) {
    return shopTransformerMethod(shopObject);
  }
  public productMediaTransformer(mediaObject) {
    return mediaObject;
  }
  public reviewsTransformer(reviewsObject) {
    return reviewsObject;
  }
  public pricingTransformer(pricingObject) {
    return pricingObject;
  }
  public healthCheck(): string {
    return 'Service running';
  }
}
