//                       <insert>

export const insertMediaQuery = (
  mediaUrl: string,
  productId: string,
): string => {
  return `
  INSERT INTO saleor.product_productmedia
   (sort_order,image,alt,"type",external_url,oembed_data,product_id,to_remove)
    VALUES
  (NULL,'ColorSwatch/${mediaUrl}','alt','IMAGE',NULL,'{}',${productId},false);
  `;
};
