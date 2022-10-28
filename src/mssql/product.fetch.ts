import { Logger } from '@nestjs/common';
import { connect, Request } from 'mssql';
import delay from 'delay';
import { config } from '../../mssql-config';
import { productDatabaseView } from 'src/types/mssql/product';
import { TBStyleSearchUniqueQuery } from './product.query';

export const getProductDetailsFromDb = async (
  productId: string,
  wait?: number,
) => {
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

const productVariantObjectTransform = (recordset) => {
  const productVariantData = {};
  const viewResponse: productDatabaseView = recordset.recordset[0];
  const { price, regular_price, item_sizes } = viewResponse;
  if (price && item_sizes) {
    productVariantData['price'] = {
      price: price,
      regular_price: regular_price,
    };
    productVariantData['sizes'] = item_sizes?.split('-');
    productVariantData['color_list'] = ['Red', 'Green'];
  }
  return productVariantData;
};
