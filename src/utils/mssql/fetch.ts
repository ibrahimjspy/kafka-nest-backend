import { Logger } from '@nestjs/common';
import { connect, Request } from 'mssql';
import delay from 'delay';
import { productDatabaseView } from 'src/types/product';
import { config } from '../../../mssql-config';

export const getProductDetails = async (productId: string, wait?: number) => {
  console.log(productId);
  const data = {};
  const delayedPromise = delay(wait || 100000, { value: 'Done' }); //setting up timeout

  new connect(config, async (err) => {
    if (err) console.log(err);
    // create Request object
    const request = new Request();
    const t = `SELECT product_id, group_id, style_name, is_hidden, style_number, group_name, category, is_plus_size, category_id, sub_category, sub_category_id, description, default_picture, color_image, brand_id, brand_name, brand_web_name, fulfillment, brand_url, vendor_active, is_prevention, patterns, sleeves, styles, is_active, is_broken, is_sale, is_preorder, available_date, is_restock, is_sold_out, is_prepare, pack_name, item_sizes, popular_point_7, popular_point_14, popular_point_30, popular_point_60, pct_1_stars, pct_2_stars, pct_3_stars, pct_4_stars, pct_5_stars, regular_price, price, sale_price, created_date, updated_date, color_list
    FROM testDB.dbo.vTBStyleSearchUnique
    WHERE product_id='${productId}'`;
    // query to the database and get the records
    return await request.query(t, function (err, recordset) {
      if (err) Logger.warn(err);
      // send records as a response
      if (recordset) {
        const viewResponse: productDatabaseView = recordset.recordset[0];
        const { price, regular_price, item_sizes } = viewResponse;
        if (price && item_sizes) {
          data['price'] = { price: price, regular_price: regular_price };
          data['sizes'] = item_sizes?.split('-');
          data['color_list'] = ['Red', 'Green'];
        }
        delayedPromise.clear(); //clearing out timeout
        return data;
      }
    });
  });
  await delayedPromise;
  return data;
};
