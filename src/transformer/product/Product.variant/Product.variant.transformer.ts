import { Injectable, Param } from '@nestjs/common';
import {
  productDatabaseViewInterface,
  productVariantInterface,
} from 'src/database/mssql/types/product';
import {
  getShoeBundleNames,
  getShoeBundlesFromDb,
  getShoeSizeColumns,
} from './Product.variant.transformer.utils';
/**
 *  Injectable class handling product transformation
 *  @Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductVariantTransformerService {
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
    console.log(object);
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
      sale_price,
      is_sale,
      is_preorder,
    } = object;

    if (price && item_sizes) {
      productVariantData['price'] = {
        purchasePrice: regular_price,
        salePrice: sale_price,
        onSale: is_sale,
      };
      productVariantData['style_name'] = style_name;
      productVariantData['sizes'] = item_sizes?.split('-');
      productVariantData['isPreOrder'] = is_preorder;
      productVariantData['color_list'] = color_list
        ? color_list.split(',')
        : ['ONE'];
      productVariantData['pack_name'] = pack_name;
      productVariantData['productGroup'] = group_name;
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
}
