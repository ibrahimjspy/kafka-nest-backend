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
import { getShoeBundles, getShoeSizes } from '../utils';

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
  const productVariantData = {};
  const viewResponse: productDatabaseViewInterface = recordset.recordset[0];
  const {
    price,
    regular_price,
    item_sizes,
    color_list,
    pack_name,
    ShoeDetails,
    group_name,
  } = viewResponse;

  if (price && item_sizes) {
    productVariantData['price'] = {
      price: price,
      regular_price: regular_price,
    };
    productVariantData['sizes'] = item_sizes?.split('-');
    productVariantData['color_list'] = color_list
      ? color_list.split(',')
      : ['ONE'];
    productVariantData['pack_name'] = pack_name;
    productVariantData['shoe_bundles'] = ShoeDetails
      ? getShoeBundles(JSON.parse(ShoeDetails))
      : [];
    productVariantData['shoe_sizes'] = ShoeDetails
      ? getShoeSizes(getShoeBundles(JSON.parse(ShoeDetails)))
      : [];
    productVariantData['productGroup'] = group_name;
  }
  return productVariantData;
};
