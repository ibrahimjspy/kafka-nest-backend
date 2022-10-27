export const TBStyleSearchUniqueQuery = (styleId: string): string => {
  return `SELECT product_id, group_id, style_name, is_hidden, style_number, group_name, category, is_plus_size, category_id, sub_category, sub_category_id, description, default_picture, color_image, brand_id, brand_name, brand_web_name, fulfillment, brand_url, vendor_active, is_prevention, patterns, sleeves, styles, is_active, is_broken, is_sale, is_preorder, available_date, is_restock, is_sold_out, is_prepare, pack_name, item_sizes, popular_point_7, popular_point_14, popular_point_30, popular_point_60, pct_1_stars, pct_2_stars, pct_3_stars, pct_4_stars, pct_5_stars, regular_price, price, sale_price, created_date, updated_date, color_list
    FROM testDB.dbo.vTBStyleSearchUnique
    WHERE product_id='${styleId}'`;
};
