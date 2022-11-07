import { Injectable, Param } from '@nestjs/common';
import { productDto, productTransformed } from 'src/types/transformers/product';
import {
  fetchMasterCategoryId,
  fetchSubCategoryId,
} from 'src/postgres/handlers/category';
import { fetchShopId } from 'src/postgres/handlers/shop';
/**
 *  Injectable class handling product transformation
 *  @Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductTransformerService {
  public healthCheck(): string {
    return 'Service running';
  }
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
    } = object;

    productObject['id'] = TBItem_ID.toString();
    productObject['name'] = nStyleName.toString();
    productObject['description'] = await this.descriptionTransformer(
      nItemDescription,
    );
    productObject['media'] = await this.mediaTransformerMethod(object);
    productObject['categoryId'] = await this.categoryIdTransformer(
      TBStyleNo_OS_Category_Master_ID,
      TBStyleNo_OS_Category_Sub_ID,
    );
    productObject['shopId'] = await this.shopIdTransformer('236');

    return productObject;
  }

  /**
   * description transformed from string format to richText(destination format)
   * @params string to be transformed
   */
  public async descriptionTransformer(@Param() description: string) {
    const validString = description.replace(/[\r\n]+/g, ' ');
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
  public async mediaTransformerMethod(@Param() productObject: productDto) {
    return [
      productObject.Picture1,
      productObject.Picture2,
      productObject.Picture3,
      productObject.Picture4,
      productObject.Picture5,
      productObject.Picture6,
      productObject.Picture7,
      productObject.Picture8,
      productObject.Picture9,
    ];
  }

  /**
   * This function returns category id of destination to be mapped
   * @params masterCategoryId
   * @params subCategoryId
   * @returns category id for destination
   */
  public async categoryIdTransformer(
    sourceMasterCategoryId: string,
    sourceSubCategoryId: string,
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
    const DEFAULT_SHOP_ID = process.env.DEFAULT_SHOP_ID || '1';

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
  public async productVariantTransformer(color: string, sizes: string[]) {
    const array = [];
    try {
      sizes.map((s) => {
        const object: any = { color: color };
        object.size = s;
        array.push(object);
      });
    } catch (error) {
      console.warn(error);
    }

    return array;
  }
}
