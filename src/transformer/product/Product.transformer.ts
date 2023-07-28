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
import {
  colorListInterface,
  productDatabaseViewInterface,
} from 'src/database/mssql/types/product';
import { fetchVendor } from 'src/database/mssql/bulk-import/methods';
import { SharoveTypeEnum, shopDto } from '../types/shop';
import { getProductDetailsFromDb } from 'src/database/mssql/product-view/getProductViewById';
import { ProductVariantTransformerService } from './Product.variant/Product.variant.transformer';
/**
 *  Injectable class handling product transformation
 *  @Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductTransformerService {
  constructor(
    private readonly productVariantTransformerService: ProductVariantTransformerService,
  ) {}
  /**
   * Transforms and validates an array of productView responses and existence.
   * @param {productDto[]} productDataArray - Array of productDto containing cdc changeData and productView data for multiple products.
   * @returns {Promise<productTransformed[]>} The transformed product objects array.
   */
  public async bulkProductGeneralTransformerMethod(
    productDataArray: productDto[],
  ): Promise<productTransformed[]> {
    const shopId = await this.shopIdTransformer(
      productDataArray[0].TBVendor_ID || productDataArray[0].TBVendor_ID?.[0],
    );

    // Fetch vendor details once for all products
    const vendorId = productDataArray[0].TBVendor_ID;
    const { productType, isSharoveFulfillment, vendorName } =
      await this.getVendorDetails(vendorId);

    const transformedProducts: productTransformed[] = await Promise.all(
      productDataArray.map(async (productData) => {
        const {
          transformedPatterns,
          transformedSleeves,
          transformedStyles,
          transformedColors,
          popularity,
          productGroup,
        } = await this.getProductAttributes(productData.TBItem_ID);

        const productObject: productTransformed = {
          id: productData.TBItem_ID?.toString(),
          styleNumber: productData.nVendorStyleNo?.toString(),
          name: productData.nStyleName?.toString(),
          description: this.descriptionTransformer(
            productData.nItemDescription,
          ),
          media: this.mediaTransformerMethod(productData),
          listing: this.channelListingTransformer(productData),
          categoryId: await this.categoryIdTransformer(
            productData.TBStyleNo_OS_Category_Master_ID,
            productData.TBStyleNo_OS_Category_Sub_ID || '100000',
          ),
          shopId: shopId, // Use the same shopId for all products in bulk
          price: this.priceTransformer(
            productData.nPrice2,
            productData.nSalePrice2,
            productData.nOnSale,
          ),
          openPack: !!productData.is_broken_pack,
          openPackMinimumQuantity: productData.min_broken_pack_order_qty,
          createdAt: new Date(productData.OriginDate).toISOString(),
          updatedAt: new Date(productData.nModifyDate).toISOString(),
          type: productType,
          styles: transformedStyles,
          sleeves: transformedSleeves,
          patterns: transformedPatterns,
          isSharoveFulfillment: isSharoveFulfillment,
          colors: transformedColors,
          variantsData: await this.getVariantsListForBulk(
            productData.TBItem_ID,
          ),
          shopName: vendorName,
          popularity: {
            ...popularity,
            popularPoint: productData.popular_point || 0,
          },
          productGroup,
        };
        return productObject;
      }),
    );

    return transformedProducts;
  }

  /**
   * Transforms and validates productView responses and existence.
   * @param {productDto} productData - Composite object containing cdc changeData and productView data.
   * @returns {Promise<productTransformed>} The transformed product object.
   */
  public async productGeneralTransformerMethod(
    @Param() productData: productDto,
  ) {
    const {
      transformedPatterns,
      transformedSleeves,
      transformedStyles,
      transformedColors,
      popularity,
      productGroup,
    } = await this.getProductAttributes(productData.TBItem_ID);
    const { productType, isSharoveFulfillment } = await this.getVendorDetails(
      productData.TBVendor_ID,
    );
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
      createdAt: new Date(productData.OriginDate).toISOString(),
      updatedAt: new Date(productData.nModifyDate).toISOString(),
      type: productType,
      styles: transformedStyles,
      sleeves: transformedSleeves,
      patterns: transformedPatterns,
      isSharoveFulfillment: isSharoveFulfillment,
      colors: transformedColors,
      popularity: {
        ...popularity,
        popularPoint: productData.popular_point || 0,
      },
      productGroup,
    };
    return productObject;
  }

  /**
   * Transforms the description from string format to richText (destination format).
   * @param {string} description - The string to be transformed.
   * @returns {string} The transformed richText description.
   */
  public descriptionTransformer(description: string): string {
    // Escape characters and preserve line breaks and tabs
    const validString = description
      .replace(/"/g, '\\"') // Escape double quotes
      .replace(/\r\n/g, '\\r\\n') // Preserve Windows-style line breaks
      .replace(/[\r\n]/g, '\\n') // Preserve Unix-style line breaks
      .replace(/\t/g, '\\t'); // Preserve tabs

    const currentTime = Date.now(); // Get current timestamp

    // Create the richText description JSON string
    const richTextDescription = `{
    "time": ${currentTime},
    "blocks": [
      {
        "id": "cqWmV3MIPH",
        "data": {
          "text": "${validString}"
        },
        "type": "paragraph"
      }
    ],
    "version": "2.24.3"
  }`;

    return richTextDescription;
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
    const { shopId } = await getShopMapping(vendorId);
    return shopId || DEFAULT_SHOP_ID;
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
    color: colorListInterface,
    sizes: string[],
    preOrder: string,
    price: priceInterface,
  ) {
    const array = [];
    try {
      sizes.map((s) => {
        const object: any = {};
        object.color = color.cColorName;
        object.colorId = color.TBColor_ID;
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
    colors: colorListInterface[],
    preOrder: string,
    price: priceInterface,
  ): Promise<any[]> {
    const variants = colors.map((color) => ({
      size,
      color: color.cColorName,
      colorId: color.TBColor_ID,
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
    const valid = 'Y';
    if (
      productData.nActive == valid &&
      productData.nVendorActive == valid &&
      productData.nSoldOut !== valid
    ) {
      return true;
    }
    return false;
  }

  /**
   * returns -- type of product set by vendor currently we have following type -- ALL , Wholesale, Retail
   *
   * returns -- fulfillment type of this product's vendor
   * @links tb vendor table tp get vendor details which includes a column for sharove type
   */
  public async getVendorDetails(vendorId: string) {
    const vendorDetails = (await fetchVendor(vendorId)) as shopDto[];
    const productType = vendorDetails[0]?.SharoveType as SharoveTypeEnum;
    const vendorName = vendorDetails[0]?.VDName;

    const isSharoveFulfillment = vendorDetails[0]?.OSFulfillmentType
      ? true
      : false;

    return { productType, isSharoveFulfillment, vendorName };
  }

  /**
   * returns styles, sleeves and patterns information against a product in form of string array
   * @param -- orangeShine product id
   */
  public async getProductAttributes(productId: string) {
    const defaultColorsList = ['ONE'];
    const {
      sleeves,
      styles,
      patterns,
      color_list,
      popular_point_7,
      popular_point_14,
      popular_point_30,
      popular_point_60,
      group_name,
    } = (await getProductDetailsFromDb(
      productId,
    )) as productDatabaseViewInterface;
    const transformedStyles = styles?.split(',')
      ? this.getMultiAttributeValue(styles)
      : null;
    const transformedSleeves = sleeves?.split(',')
      ? this.getMultiAttributeValue(sleeves)
      : null;
    const transformedPatterns = patterns?.split(',')
      ? this.getMultiAttributeValue(patterns)
      : null;
    const transformedColors = this.getMultiColorAttributeValue(
      JSON.parse(color_list).color_list.length
        ? JSON.parse(color_list).color_list
        : defaultColorsList,
    );
    const popularity = {
      popularPoint7: popular_point_7 || 0,
      popularPoint14: popular_point_14 || 0,
      popularPoint30: popular_point_30 || 0,
      popularPoint60: popular_point_60 || 0,
    };
    const productGroup = group_name;

    return {
      transformedStyles,
      transformedSleeves,
      transformedPatterns,
      transformedColors,
      popularity,
      productGroup,
    };
  }

  /**
   * attribute values for multiselect option for gql
   * @param -- orangeShine raw comma separated string
   */
  public getMultiAttributeValue(values: string): {
    value: string;
  }[] {
    return (values.split(',') || []).map((value) => {
      return { value: value };
    });
  }

  /**
   * color attribute values for multiselect option for gql
   * @warn -- it is currently used only for search
   * @param -- orangeShine raw comma separated string
   */
  public getMultiColorAttributeValue(colorList: colorListInterface[]): {
    value: string;
  }[] {
    return colorList.map((color) => {
      return { value: color.cColorName };
    });
  }

  public async getVariantsListForBulk(productId: string) {
    const databaseVariantsData = (await getProductDetailsFromDb(
      productId,
    )) as productDatabaseViewInterface;
    const transformDatabaseData =
      await this.productVariantTransformerService.productViewTransformer(
        databaseVariantsData,
      );
    const productVariantsList =
      await this.productVariantTransformerService.transformProductVariantData(
        transformDatabaseData,
      );
    return productVariantsList;
  }
}
