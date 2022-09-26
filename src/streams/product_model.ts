import { Injectable } from '@nestjs/common';
import { productGeneralTransform } from 'src/transforms/productGeneral';
import { seoTransform } from 'src/transforms/seo';
/**
 * Transformation class with utility methods performing specific
 *  transformations on product Object and its utilities
 */
@Injectable()
export class ProductModelTransformService {
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
    return seoTransform(productObject);
  }
  public generalTransform(productObject) {
    return productGeneralTransform(productObject);
  }
}
