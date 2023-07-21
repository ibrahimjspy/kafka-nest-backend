import { Inject, Injectable, Param, forwardRef } from '@nestjs/common';
import {
  productDatabaseViewInterface,
  productVariantInterface,
} from 'src/database/mssql/types/product';
import {
  getShoeBundleNames,
  getShoeBundlesFromDb,
  getShoeSizeColumns,
} from './Product.variant.transformer.utils';
import { ProductTransformerService } from '../Product.transformer';
import { createSkuHandler } from 'src/graphql/handlers/sku';
import { addSkuToProductVariants } from 'src/services/product/variant/Product.Variant.utils';
/**
 *  Injectable class handling product transformation
 *  @Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductVariantTransformerService {
  constructor(
    @Inject(forwardRef(() => ProductTransformerService))
    private readonly productTransformerService: ProductTransformerService,
  ) {}
  /**
   * @description this transformation function is built as an abstract layer to fetch database variant data
   * @step it underneath is validating values , transforming db properties to meet CDC service requirements
   * @records you can verify through inspecting productVariantInterface
   * @returns :
   * @property - price = regular price of product
   * @property - sizes = sizes of a product
   * @property - color_list = colors array of product by default ONE if there are not present
   * @property - pack_name = bundle information
   * @property - shoe_bundles = bundles array of shoes
   * @property - shoe_sizes = unique sizes given shoe
   * @property - productGroup = product related category
   */
  public async productViewTransformer(
    @Param() object: productDatabaseViewInterface,
  ) {
    let productVariantData: productVariantInterface = {};
    const {
      style_name,
      price,
      regular_price,
      item_sizes,
      color_list,
      pack_name,
      ShoeDetails,
      group_name,
      is_sale,
      is_preorder,
      TBSizeChart_ID,
      product_id,
    } = object;

    if (price && item_sizes) {
      productVariantData['product_id'] = product_id;
      productVariantData['price'] = {
        purchasePrice: regular_price,
        salePrice: price,
        onSale: is_sale,
        retailPrice:
          this.productTransformerService.retailPriceTransformer(price),
      };
      productVariantData['style_name'] = style_name;
      productVariantData['sizes'] = item_sizes?.split('-');
      productVariantData['isPreOrder'] = is_preorder;
      productVariantData['color_list'] = JSON.parse(color_list).color_list
        .length
        ? JSON.parse(color_list).color_list
        : ['ONE'];
      productVariantData['pack_name'] = pack_name;
      productVariantData['productGroup'] = group_name;
      productVariantData['sizeChartId'] = TBSizeChart_ID;
      productVariantData['variant_media'] = object['ColorMedia']
        ? JSON.parse(object['ColorMedia'])
        : null;
      // shoe information with bundles
      if (ShoeDetails) {
        productVariantData = this.shoeTransformer(
          ShoeDetails,
          productVariantData,
        );
      }
    }
    return productVariantData;
  }

  /**
   * transforms and validates productView responses and existence
   * @value id
   * @value description
   * @value name
   * @params object,  Composite object containing cdc changeData, productView data
   */
  public shoeTransformer(
    shoeDetails,
    @Param() productVariantObject: productVariantInterface,
  ): productVariantInterface {
    productVariantObject['shoe_bundles'] = getShoeBundlesFromDb(
      JSON.parse(shoeDetails),
    );

    productVariantObject['shoe_sizes'] = getShoeSizeColumns(
      getShoeBundlesFromDb(JSON.parse(shoeDetails)),
    );

    productVariantObject['shoe_bundle_name'] = getShoeBundleNames(
      JSON.parse(shoeDetails),
    );
    return productVariantObject;
  }

  /**
   * Transforms and validates product variant data.
   * @param {productVariantInterface} productVariantData - Product variant data to be transformed.
   * @returns {Promise<any[]>} An array of transformed product variants.
   */
  public async transformProductVariantData(
    productVariantData: productVariantInterface,
  ): Promise<any[]> {
    const { sizes, price, color_list, isPreOrder, product_id, sizeChartId } =
      productVariantData;
    const productVariants = [];

    if (color_list) {
      // Use Promise.all to handle multiple asynchronous calls in parallel
      const variantPromises = color_list.map((color) =>
        this.productTransformerService.productVariantTransformer(
          color,
          sizes,
          isPreOrder,
          price,
        ),
      );

      const variants = await Promise.all(variantPromises);
      for (const variant of variants) {
        productVariants.push(...variant);
      }

      const skuMap = await createSkuHandler(
        productVariants,
        product_id,
        sizeChartId,
      );
      addSkuToProductVariants(skuMap, productVariants);
    }

    return productVariants;
  }
}
