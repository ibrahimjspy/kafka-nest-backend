import { Injectable } from '@nestjs/common';
import { CategoryTransformerService } from './category/Category.transformer';
import { ProductTransformerService } from './product/Product.transformer';
import { ShopTransformerService } from './shop/Shop.transformer';

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
   * color and size transformer for variant mapping
   * @returns variants array ready to be mapped variant api with color and sizes against it
   */
  public productVariantTransformer(color, sizes, price) {
    return this.productTransformerService.productVariantTransformer(
      color,
      sizes,
      price,
    );
  }
  /**
   * color and size transformer for shoe variant mapping
   * @returns variants array ready to be mapped variant api with color and sizes against it
   */
  public shoeVariantTransformer(size, colors, price) {
    return this.productTransformerService.shoeVariantTransformer(
      size,
      colors,
      price,
    );
  }
  public pricingTransformer(pricingObject) {
    return pricingObject;
  }
  public healthCheck(): string {
    return 'Service running';
  }
}
