import { Injectable } from '@nestjs/common';
import { CategoryTransformerService } from './category/Category.transformer';
import { ProductTransformerService } from './product/Product.transformer';
import { RetailerTransformerService } from './shop/Retailer.transformer';
import { ShopTransformerService } from './shop/Shop.transformer';
import { ProductVariantTransformerService } from './product/Product.variant/Product.variant.transformer';

/**
 * Transformation class with utility methods performing specific
 *  transformations on product Object and its utilities
 * @params CDC object to transform and validate
 */
@Injectable()
export class TransformerService {
  constructor(
    private readonly productTransformerService: ProductTransformerService,
    private readonly categoryTransformerService: CategoryTransformerService,
    private readonly shopTransformerService: ShopTransformerService,
    private readonly retailerTransformerService: RetailerTransformerService,
    private readonly productVariantTransformerService: ProductVariantTransformerService,
  ) {}
  /**
   * complete product object transform
   * @params productObject
   */
  public productTransformer(productObject) {
    this.masterCategoryTransformer(productObject);
    this.productMediaTransformer(productObject);
    this.pricingTransformer(productObject);
    this.productDetailsTransformer(productObject);
    return productObject;
  }
  /**
   * master category transform and validate
   * @returns category object ready to be mapped against Api interface
   */
  public masterCategoryTransformer(categoryObject) {
    return this.categoryTransformerService.masterCategoryTransformerMethod(
      categoryObject,
    );
  }
  /**
   * sub category transform and validate
   * @returns category object ready to be mapped against Api interface
   */
  public subCategoryTransformer(categoryObject) {
    return this.categoryTransformerService.subCategoryTransformerMethod(
      categoryObject,
    );
  }
  /**
   * product details transform and validate
   * name, description, category
   * @returns product information object ready to be mapped against Api interface
   */
  public productDetailsTransformer(productObject) {
    return this.productTransformerService.productGeneralTransformerMethod(
      productObject,
    );
  }
  /**
   * shop transform and validate
   * @returns shop object ready to be mapped against Api interface
   */
  public shopTransformer(shopObject) {
    return this.shopTransformerService.shopTransformerMethod(shopObject);
  }
  /**
   * media transform and validate
   * @returns media array ready to be mapped against Api media create api
   */
  public productMediaTransformer(mediaObject) {
    return this.productTransformerService.mediaTransformerMethod(mediaObject);
  }
  /**
   * This function returns variants based on color and its sizes
   * @params color to be created as variant
   * @params array of sizes to be mapped with color
   * @params preOrder information
   * @params pricing information
   * @returns collection of variants to be created <Array>
   */
  public productVariantTransformer(color, sizes, preOrder, price) {
    return this.productTransformerService.productVariantTransformer(
      color,
      sizes,
      preOrder,
      price,
    );
  }
  /**
   * This function returns variants based on color and its sizes
   * @params size to be created as variant
   * @params array of colors to be mapped with color
   * @params preOrder information
   * @params pricing information
   * @returns collection of variants to be created <Array>
   */
  public shoeVariantTransformer(size, colors, preOrder, price) {
    return this.productTransformerService.shoeVariantTransformer(
      size,
      colors,
      preOrder,
      price,
    );
  }
  /**
   * transforms source customer object according to destination retailer requirements
   */
  public retailerTransformer(object) {
    return this.retailerTransformerService.retailerTransformerMethod(object);
  }
  public pricingTransformer(pricingObject) {
    return pricingObject;
  }

  /**
   * transforms database view for product variant
   * @returns transformed product variant object
   */
  public productViewTransformer(viewObject) {
    return this.productVariantTransformerService.productViewTransformer(
      viewObject,
    );
  }

  public healthCheck(): string {
    return 'Service running';
  }
}
