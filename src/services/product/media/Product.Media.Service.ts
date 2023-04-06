import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { stringValidation } from 'src/app.utils';
import { productVariantInterface } from 'src/database/mssql/types/product';
import {
  fetchProductMediaId,
  insertProductMediaById,
  insertThumbnailMediaById,
  insertVariantMedia,
} from 'src/database/postgres/handlers/media';
import { getProductDetailsHandler } from 'src/graphql/handlers/product';
import { mediaDto, productTransformed } from 'src/transformer/types/product';
import { ProductService } from '../Product.Service';
import { idBase64Decode, mediaUrlMapping } from '../Product.utils';
import {
  getVariantIdsByColor,
  getVariantMediaById,
} from './Product.Media.utils';
/**
 *  Injectable class handling media assign
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductMediaService {
  constructor(
    @Inject(forwardRef(() => ProductService))
    private readonly productClass: ProductService,
  ) {}

  public async productMediaAssign(productMedia: mediaDto[], productId) {
    // Validating media url and inserting it to DB
    const createMedia = Promise.all(
      productMedia.map(async (image) => {
        if (image.medium && stringValidation(image.medium)) {
          // create standard media
          await insertProductMediaById(image.medium, productId);
          const productMediaId = await fetchProductMediaId(
            image.medium,
            productId,
          );
          // create thumbnails
          if (productMediaId) {
            this.productThumbnailsAssign(image, productMediaId);
          }
        }
      }),
    );
    return createMedia;
  }

  public async productMediaUpdate(
    productId: string,
    sourceProductData: productTransformed,
  ) {
    const productDetails = await getProductDetailsHandler(productId);
    if (productDetails.media.length === 0) {
      return await this.productClass.productMediaCreate(
        productId,
        sourceProductData.media,
      );
    }
    const newMedia = mediaUrlMapping(
      sourceProductData.media,
      productDetails.media,
    );
    if (newMedia) {
      return await this.productClass.productMediaCreate(productId, newMedia);
    }
    return;
  }

  public async productThumbnailsAssign(productMedia: mediaDto, productMediaId) {
    // Validating media url and inserting it to DB
    if (productMedia.small) {
      await insertThumbnailMediaById({
        mediaUrl: productMedia.small,
        size: '256',
        productId: productMediaId,
      });
    }
    if (productMedia.large) {
      await insertThumbnailMediaById({
        mediaUrl: productMedia.large,
        size: '1024',
        productId: productMediaId,
      });
    }
    if (productMedia.tiny) {
      await insertThumbnailMediaById({
        mediaUrl: productMedia.tiny,
        size: '128',
        productId: productMediaId,
      });
    }
    return;
  }

  public async productVariantMediaAssign(
    productId: string,
    productVariantData: productVariantInterface,
  ) {
    const productDetails = await getProductDetailsHandler(productId);
    if (
      !productDetails.variants[0]?.media[0]?.url &&
      productVariantData.variant_media
    ) {
      // getting media ids of each product color
      const mediaIds = await this.createVariantMedia(
        productVariantData.variant_media['ColorMedia'],
        productId,
        idBase64Decode(productDetails['media'][0]?.id),
      );

      // getting variantIds of all product colors
      const variantIds = getVariantIdsByColor(
        productDetails['variants'],
        productVariantData.color_list,
      );

      // mapping variant ids with media ids
      const variantMedia = getVariantMediaById(variantIds, mediaIds);

      // inserting media ids  against variant ids using mapping array
      await Promise.all(
        variantMedia?.map(async (media) => {
          return await insertVariantMedia(
            media['colorImage'],
            media['variantId'],
          );
        }),
      );
      Logger.verbose(
        `variant media created against product id === ${productDetails.productId}`,
      );
    }
  }

  public async createVariantMedia(
    productVariantMedia,
    productId,
    defaultMediaId,
  ) {
    const mediaIds = {};
    await Promise.all(
      productVariantMedia?.map(async (media) => {
        const url: string = media['color_image'];
        // creates media against that color
        if (url.includes('ColorSwatch')) {
          await insertProductMediaById(
            `ColorSwatch/${url.split('ColorSwatch/')[1]}`,
            idBase64Decode(productId),
          );
          const productMediaId = await fetchProductMediaId(
            `ColorSwatch/${url.split('ColorSwatch/')[1]}`,
            idBase64Decode(productId),
          );
          mediaIds[`${media.color_name}`] = productMediaId;
          return mediaIds;
        }
        // checks if media all ready exists in product scope
        mediaIds[`${media.color_name}`] = defaultMediaId;
        return;
      }),
    );
    return mediaIds;
  }
}
