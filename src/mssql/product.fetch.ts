import { Logger } from '@nestjs/common';
import { connect, Request } from 'mssql';
import delay from 'delay';
import { config } from '../../mssql-config';
import {
  productDatabaseViewInterface,
  productVariantInterface,
} from 'src/types/mssql/product';
import { TBStyleSearchUniqueQuery } from './query';

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
          Logger.warn('retry needed');
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

const productVariantObjectTransform = (recordset): productVariantInterface => {
  const productVariantData = {};
  const viewResponse: productDatabaseViewInterface = recordset.recordset[0];
  const { price, regular_price, item_sizes, color_list } = viewResponse;
  if (price && item_sizes) {
    productVariantData['price'] = {
      price: price,
      regular_price: regular_price,
    };
    productVariantData['sizes'] = item_sizes?.split('-');
    productVariantData['color_list'] = color_list ? color_list.split(',') : [];
    productVariantData['pack_name'] = viewResponse.pack_name;
  }
  return productVariantData;
};
