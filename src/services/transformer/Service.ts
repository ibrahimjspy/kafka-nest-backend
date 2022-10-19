import { Injectable } from '@nestjs/common';
import { masterCategoryTransformerMethod } from 'src/services/transformer/methods/category/master';
import { subCategoryTransformerMethod } from 'src/services/transformer/methods/category/sub';
import { productGeneralTransformerMethod } from 'src/services/transformer/methods/product/general';
import { productMediaTransformerMethod } from './methods/product/media';
import { colorVariantTransformerMethod } from './methods/product/variant';
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
  /**
   * media transform and validate
   * @returns media array ready to be mapped against Api media create api
   */
  public productMediaTransformer(mediaObject) {
    return productMediaTransformerMethod(mediaObject);
  }
  /**
   * color and size transformer for variant mapping
   * @returns variants array ready to be mapped variant api with color and sizes against it
   */
  public productColorTransformer(color, sizes) {
    return colorVariantTransformerMethod(color, sizes);
  }
  public pricingTransformer(pricingObject) {
    return pricingObject;
  }
  public healthCheck(): string {
    return 'Service running';
  }
}
