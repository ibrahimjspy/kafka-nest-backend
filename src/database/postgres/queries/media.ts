//                       <insert>

import { thumbnailQuery } from '../types/thumbnail';

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

export const insertThumbnailQuery: thumbnailQuery = ({
  mediaUrl,
  productId,
  size,
}): string => {
  return `
  INSERT INTO saleor.thumbnail_thumbnail
  (image, "size", product_media_id)
  VALUES('${mediaUrl}', ${size}, '${productId}');
  `;
};

//                       <fetch>

export const fetchMediaIdQuery = (
  mediaUrl: string,
  productId: string,
): string => {
  return `
  SELECT id 
  FROM saleor.product_productmedia pp  
  WHERE product_id =${productId} AND Image='ColorSwatch/${mediaUrl}';
  `;
};
