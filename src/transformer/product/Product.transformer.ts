import { Injectable, Param } from '@nestjs/common';
import { productDto, productTransformed } from 'src/transformer/types/product';
import {
  fetchMasterCategoryId,
  fetchSubCategoryId,
} from 'src/database/postgres/handlers/category';
import { fetchShopId } from 'src/database/postgres/handlers/shop';
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
    } = object;
    productObject['id'] = TBItem_ID.toString();
    productObject['name'] = nStyleName.toString();
    productObject['description'] =
      this.descriptionTransformer(nItemDescription);
    productObject['media'] = this.mediaTransformerMethod(object);
    productObject['categoryId'] = TBStyleNo_OS_Category_Sub_ID
      ? await this.categoryIdTransformer(
          TBStyleNo_OS_Category_Master_ID,
          TBStyleNo_OS_Category_Sub_ID,
        )
      : await this.categoryIdTransformer(
          TBStyleNo_OS_Category_Master_ID,
          100000,
        );

    productObject['shopId'] = await this.shopIdTransformer(TBVendor_ID);
    productObject['price'] = object.nPrice1;

    return productObject;
  }

  /**
   * description transformed from string format to richText(destination format)
   * @params string to be transformed
   */
  public descriptionTransformer(@Param() description: string) {
    const validString = description.replace(/"/g, "'").replace(/[\r\n]+/g, ' ');
    if (validString) {
      return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"${validString}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
    }
    return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"test product\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
  }

  /**
   * media object transformed to a mappable array from object
   * @params object to be transformed and mapped
   * @returns media composite array
   */
  public mediaTransformerMethod(@Param() productObject: object): string[] {
    const urls = [];
    for (let i = 1; i < 10; i++) {
      urls.push(productObject[`Picture${i}`]);
      urls.push(productObject[`PictureZ${i}`]);
      urls.push(productObject[`PictureV${i}`]);
      urls.push(productObject[`PictureS${i}`]);
    }
    return urls;
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
    const DEFAULT_CATEGORY_ID =
      process.env.DEFAULT_CATEGORY_ID || 'Q2F0ZWdvcnk6MQ==';

    const destinationSubCategoryId: string = await fetchSubCategoryId(
      sourceSubCategoryId,
      sourceMasterCategoryId,
    );
    if (destinationSubCategoryId) {
      return destinationSubCategoryId;
    }

    const destinationMasterCategoryId: string = await fetchMasterCategoryId(
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
    const DEFAULT_SHOP_ID = process.env.DEFAULT_SHOP_ID || '16';

    const destinationShopId = await fetchShopId(vendorId);
    if (destinationShopId) {
      return destinationShopId;
    }

    return DEFAULT_SHOP_ID;
  }
  /**
   * This function returns variants based on color and its sizes
   * @params color to be created as variant
   * @params array of sizes to be mapped with color
   * @returns collection of variants to be created <Array>
   */
  public async productVariantTransformer(
    color: string,
    sizes: string[],
    price: string,
  ) {
    const array = [];
    try {
      sizes.map((s) => {
        const object: any = { color: color };
        object.size = s;
        object.price = price;
        array.push(object);
      });
    } catch (error) {
      console.warn(error);
    }

    return array;
  }
}
