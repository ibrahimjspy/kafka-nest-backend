import { Injectable } from '@nestjs/common';
import { productGeneralTransformer } from 'src/transformers/productGeneral';
import { seoTransformer } from 'src/transformers/seo';
/**
 * Transformation class with utility methods performing specific
 *  transformations on product Object and its utilities
 */
@Injectable()
export class ProductModelTransformerService {
  /**
   * complete product object transform
   * @params productObject
   */
  public productTransform(productObject) {
    this.categoryTransform(productObject);
    this.productMediaTransform(productObject);
    this.reviewsTransform(productObject);
    this.pricingTransform(productObject);
    this.seoTransform(productObject);
    this.generalTransform(productObject);
    return productObject;
  }
  public categoryTransform(productObject) {
    return productObject;
  }
  public productMediaTransform(productObject) {
    return productObject;
  }
  public reviewsTransform(productObject) {
    return productObject;
  }
  public pricingTransform(productObject) {
    return productObject;
  }
  public seoTransform(productObject) {
    return seoTransformer(productObject);
  }
  public generalTransform(productObject) {
    return productGeneralTransformer(productObject);
  }
}
