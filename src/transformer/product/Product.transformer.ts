import { Injectable, Param } from '@nestjs/common';
import {
  mediaDto,
  priceInterface,
  productDto,
  productTransformed,
} from 'src/transformer/types/product';
import {
  getMasterCategoryMapping,
  getSubCategoryMapping,
} from 'src/mapping/methods/category';
import { getShopMapping } from 'src/mapping/methods/shop';
import { DEFAULT_CATEGORY_ID, DEFAULT_SHOP_ID } from '../../../common.env';
import { validateMediaArray } from 'src/services/product/media/Product.Media.utils';
/**
 *  Injectable class handling product transformation
 *  @Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductTransformerService {
  /**
   * Transforms and validates productView responses and existence.
   * @param {productDto} productData - Composite object containing cdc changeData and productView data.
   * @returns {Promise<productTransformed>} The transformed product object.
   */
  public async productGeneralTransformerMethod(
    @Param() productData: productDto,
  ) {
    const productObject: productTransformed = {
      id: productData.TBItem_ID?.toString(),
      styleNumber: productData.nVendorStyleNo?.toString(),
      name: productData.nStyleName?.toString(),
      description: this.descriptionTransformer(productData.nItemDescription),
      media: this.mediaTransformerMethod(productData),
      listing: this.channelListingTransformer(productData),
      categoryId: await this.categoryIdTransformer(
        productData.TBStyleNo_OS_Category_Master_ID,
        productData.TBStyleNo_OS_Category_Sub_ID || '100000',
      ),
      shopId: await this.shopIdTransformer(
        productData.TBVendor_ID || productData.TBVendor_ID?.[0],
      ),
      price: this.priceTransformer(
        productData.nPrice2,
        productData.nSalePrice2,
        productData.nOnSale,
      ),
      openPack: !!productData.is_broken_pack,
      openPackMinimumQuantity: productData.min_broken_pack_order_qty,
    };

    return productObject;
  }

  /**
   * Transforms the description from string format to richText (destination format).
   * @param {string} description - The string to be transformed.
   * @returns {string} The transformed richText description.
   */
  public descriptionTransformer(description: string): string {
    const validString =
      description?.replace(/"/g, "'").replace(/[\r\n]+/g, ' ') || '';
    return `{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "${validString}"}, "type": "paragraph"}], "version": "2.24.3"}`;
  }

  /**
   * Transforms the media object to a mappable array from an object.
   * @param {productDto} productObject - The object to be transformed and mapped.
   * @returns {mediaDto[]} The transformed media composite array.
   */
  public mediaTransformerMethod(
    @Param() productObject: productDto,
  ): mediaDto[] {
    const mediaArray: mediaDto[] = [];
    for (let i = 1; i < 10; i++) {
      const image: mediaDto = {};
      image.tiny = productObject[`PictureL${i}`];
      image.small = productObject[`PictureV${i}`];
      image.medium = productObject[`Picture${i}`];
      image.large = productObject[`PictureZ${i}`];
      mediaArray.push(image);
    }
    return validateMediaArray(mediaArray);
  }

  /**
   * This function returns category id of destination to be mapped
   * @params masterCategoryId
   * @params subCategoryId
   * @returns category id for destination
   */
  public async categoryIdTransformer(
    sourceMasterCategoryId: string,
    sourceSubCategoryId,
  ) {
    const destinationSubCategoryId: string = await getSubCategoryMapping(
      sourceSubCategoryId,
      sourceMasterCategoryId,
    );
    if (destinationSubCategoryId) {
      return destinationSubCategoryId;
    }
    const destinationMasterCategoryId: string = await getMasterCategoryMapping(
      sourceMasterCategoryId,
    );
    if (destinationMasterCategoryId) {
      return destinationMasterCategoryId;
    }
    return DEFAULT_CATEGORY_ID;
  }

  /**
   * This function returns shop id in destination
   * @params TBVendor_ID as input
   */
  public async shopIdTransformer(vendorId: string) {
    const destinationShopId = await getShopMapping(vendorId);
    if (destinationShopId) {
      return destinationShopId;
    }

    return DEFAULT_SHOP_ID;
  }
  /**
   * This function returns variants based on color and its sizes
   * @params color to be created as variant
   * @params array of sizes to be mapped with color
   * @params preOrder information
   * @params pricing information
   * @returns collection of variants to be created <Array>
   */
  public async productVariantTransformer(
    color: string,
    sizes: string[],
    preOrder: string,
    price: priceInterface,
  ) {
    const array = [];
    try {
      sizes.map((s) => {
        const object: any = { color: color };
        object.size = s;
        object.preOrder = preOrder;
        object.price = price;
        array.push(object);
      });
    } catch (error) {
      console.warn(error);
    }

    return array;
  }
  /**
   * Generates shoe variants based on the provided size, colors, preOrder, and price.
   * @param size - The size to be created as a variant.
   * @param colors - The array of colors to be mapped with the size.
   * @param preOrder - The preOrder information.
   * @param price - The pricing information.
   * @returns An array of shoe variants to be created.
   */
  public async shoeVariantTransformer(
    size: string,
    colors: string[],
    preOrder: string,
    price: priceInterface,
  ): Promise<any[]> {
    const variants = colors.map((color) => ({
      size,
      color,
      price,
      preOrder,
    }));
    return variants;
  }

  /**
   * This function returns pricing information
   */
  public priceTransformer(purchasePrice, salePrice, onSale): priceInterface {
    const productMinimumPrice = onSale == 'Y' ? salePrice : purchasePrice;
    return {
      purchasePrice: productMinimumPrice,
      salePrice: productMinimumPrice,
      onSale: onSale,
      retailPrice: this.retailPriceTransformer(productMinimumPrice),
    };
  }

  /**
   * Transforms the purchase price to the retail price based on a constant rule.
   * @param {string} purchasePrice - The purchase price to be transformed.
   * @returns {string} The transformed retail price.
   */
  public retailPriceTransformer(purchasePrice): string {
    const RULE_ENGINE = 1.6;
    const retailPrice = (Number(purchasePrice) * RULE_ENGINE).toFixed(2);
    return retailPrice;
  }

  /**
   * this method adds channel listing to transformed data
   */
  public channelListingTransformer(productData: productDto): boolean {
    if (productData.nActive == 'Y' && productData.nVendorActive == 'Y') {
      return true;
    }
    return false;
  }
}
