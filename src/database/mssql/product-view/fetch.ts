import { Logger } from '@nestjs/common';
import { connect, Request } from 'mssql';
import delay from 'delay';
import { config } from '../../../../mssql-config';
import {
  productDatabaseViewInterface,
  productVariantInterface,
} from 'src/database/mssql/types/product';
import { TBStyleSearchUniqueQuery } from '../query';
// import { mockShoeBundles, mockShoeSizes } from 'mock/shoes/bundles';
import {
  getShoeBundleNames,
  getShoeBundlesFromDb,
  getShoeSizeColumns,
} from '../utils';

/**
 * returns product variants information of a given product, giving information such as colors , shoe sizes , bundles, media and discount e.t.c
 * @links productVariantObjectTransform < validation object builder > parses database response according to our requirements
 * @param productID
 * @param wait - optional -- high level parameter setting a transaction threshold of how long this transaction can go on before throwing error
 */
export const getProductDetailsFromDb = async (
  productId: string,
  wait?: number,
): Promise<productVariantInterface> => {
  let data = {};
  const sqlTransaction = delay(wait || 10000, { value: 'Done' }); //setting up sql transaction

  new connect(config, async (err) => {
    if (err) {
      Logger.warn(err);
      sqlTransaction.clear(); // aborting sql transaction
    }
    // requesting db with StyleSearchUnique query
    const request = new Request();
    return await request.query(
      TBStyleSearchUniqueQuery(productId),
      function (err, recordset) {
        if (err) {
          Logger.warn(err);
          sqlTransaction.clear(); // aborting sql transaction
        }
        // send records as a response
        if (recordset.recordset[0]) {
          data = productVariantObjectTransform(recordset);
          sqlTransaction.clear(); // aborting sql transaction
          return data;
        }
      },
    );
  });
  await sqlTransaction;
  return data;
};

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
const productVariantObjectTransform = (recordset): productVariantInterface => {
  let productVariantData: productVariantInterface = {};
  const viewResponse: productDatabaseViewInterface = recordset.recordset[0];
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
  } = viewResponse;

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
    productVariantData['variant_media'] = JSON.parse(
      viewResponse['ColorMedia'],
    );
    // shoe information with bundles
    if (ShoeDetails) {
      productVariantData = shoeTransformer(ShoeDetails, productVariantData);
    }
  }
  return productVariantData;
};

/**
 * adds hoe information such as shoe bundles and sizes to variant object
 */
export const shoeTransformer = (
  shoeDetails,
  productVariantObject: productVariantInterface,
) => {
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
};
