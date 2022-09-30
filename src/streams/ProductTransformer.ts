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
  public productTransformer(productObject) {
    this.categoryTransformer(productObject);
    this.productMediaTransformer(productObject);
    this.reviewsTransformer(productObject);
    this.pricingTransformer(productObject);
    this.seoTransformer(productObject);
    this.generalTransformer(productObject);
    return productObject;
  }
  public categoryTransformer(productObject) {
    return productObject;
  }
  public productMediaTransformer(productObject) {
    return productObject;
  }
  public reviewsTransformer(productObject) {
    return productObject;
  }
  public pricingTransformer(productObject) {
    return productObject;
  }
  public seoTransformer(productObject) {
    return seoTransformer(productObject);
  }
  public generalTransformer(productObject) {
    return productGeneralTransformer(productObject);
  }
}
