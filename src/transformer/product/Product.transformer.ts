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
   * transforms and validates productView responses and existence
   * @value id
   * @value description
   * @value name
   * @params object,  Composite object containing cdc changeData, productView data
   */
  public async productGeneralTransformerMethod(@Param() object: productDto) {
    const productObject: productTransformed = {};
    const {
      TBItem_ID,
      nStyleName,
      nItemDescription,
      TBStyleNo_OS_Category_Master_ID,
      TBStyleNo_OS_Category_Sub_ID,
      TBVendor_ID,
      nVendorStyleNo,
      nSalePrice,
      nOnSale,
      nPrice2,
    } = object;
    productObject['id'] = TBItem_ID.toString();
    productObject['styleNumber'] = nVendorStyleNo.toString();
    productObject['name'] = nStyleName.toString();
    productObject['description'] =
      this.descriptionTransformer(nItemDescription);
    productObject['media'] = this.mediaTransformerMethod(object);
    productObject['listing'] = this.channelListingTransformer(object);
    productObject['categoryId'] = TBStyleNo_OS_Category_Sub_ID
      ? await this.categoryIdTransformer(
          TBStyleNo_OS_Category_Master_ID,
          TBStyleNo_OS_Category_Sub_ID,
        )
      : await this.categoryIdTransformer(
          TBStyleNo_OS_Category_Master_ID,
          '100000',
        );
    productObject['shopId'] = await this.shopIdTransformer(
      TBVendor_ID ? TBVendor_ID : TBVendor_ID[0],
    );
    productObject['price'] = this.priceTransformer(
      nPrice2,
      nSalePrice,
      nOnSale,
    );

    return productObject;
  }

  /**
   * description transformed from string format to richText(destination format)
   * @params string to be transformed
   */
  public descriptionTransformer(@Param() description: string) {
    const validString = description
      ?.replace(/"/g, "'")
      .replace(/[\r\n]+/g, ' ');
    if (validString) {
      return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"${validString}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
    }
    return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \" \"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
  }

  /**
   * media object transformed to a mappable array from object
   * @params object to be transformed and mapped
   * @returns media composite array
   */
  public mediaTransformerMethod(@Param() productObject: object): mediaDto[] {
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
   * This function returns variants based on color and its sizes
   * @params size to be created as variant
   * @params array of colors to be mapped with color
   * @params preOrder information
   * @params pricing information
   * @returns collection of variants to be created <Array>
   */
  public async shoeVariantTransformer(
    size: string,
    colors: string[],
    preOrder: string,
    price: priceInterface,
  ) {
    const array = [];
    try {
      colors.map((color) => {
        const object: any = { size: size };
        object.color = color;
        object.price = price;
        object.preOrder = preOrder;
        array.push(object);
      });
    } catch (error) {
      console.warn(error);
    }

    return array;
  }

  /**
   * This function returns pricing information
   */
  public priceTransformer(purchasePrice, salePrice, onSale): priceInterface {
    return {
      purchasePrice: purchasePrice,
      salePrice: salePrice,
      onSale: onSale,
      retailPrice: this.retailPriceTransformer(purchasePrice),
    };
  }

  /**
   * This function returns retail price based on  a constant rule
   */
  public retailPriceTransformer(purchasePrice): string {
    const RULE_ENGINE = 1.6;
    return `${
      Math.round((Number(purchasePrice) * RULE_ENGINE + Number.EPSILON) * 100) /
      100
    }`;
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
