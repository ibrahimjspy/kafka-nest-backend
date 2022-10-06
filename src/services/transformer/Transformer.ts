import { Injectable } from '@nestjs/common';
import { productGeneralTransformer } from 'src/transformers/productGeneral';
import { seoTransformer } from 'src/transformers/seo';
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
    this.categoryTransformer(productObject);
    this.productMediaTransformer(productObject);
    this.reviewsTransformer(productObject);
    this.pricingTransformer(productObject);
    this.seoTransformer(productObject);
    this.generalTransformer(productObject);
    return productObject;
  }
  public categoryTransformer(categoryObject) {
    return categoryObject;
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
  public seoTransformer(seoObject) {
    return seoTransformer(seoObject);
  }
  public generalTransformer(productObject) {
    return productGeneralTransformer(productObject);
  }
  public healthCheck(): string {
    return 'Service running';
  }
}
