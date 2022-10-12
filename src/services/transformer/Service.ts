import { Injectable } from '@nestjs/common';
import { masterCategoryTransformer } from 'src/services/transformer/methods/category/master';
import { subCategoryTransformer } from 'src/services/transformer/methods/category/sub';
import { productGeneralTransformer } from 'src/services/transformer/methods/product/general';
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
    return masterCategoryTransformer(categoryObject);
  }
  /**
   * sub category transform and validate
   * @returns category object ready to be mapped against Api interface
   */
  public subCategoryTransformer(categoryObject) {
    return subCategoryTransformer(categoryObject);
  }
  /**
   * product details transform and validate
   * name, description, category
   * @returns product information object ready to be mapped against Api interface
   */
  public generalTransformer(productObject) {
    return productGeneralTransformer(productObject);
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
