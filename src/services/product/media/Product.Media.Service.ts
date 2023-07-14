import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { stringValidation } from 'src/app.utils';
import {
  MediaColorListInterface,
  productVariantInterface,
} from 'src/database/mssql/types/product';
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
import { ApplicationLogger } from 'src/logger/Logger.service';
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
    public logger: ApplicationLogger,
  ) {}

  /**
   * Assigns product media to a given product ID.
   * Validates the media URLs and inserts them into the database.
   * Creates thumbnails for the inserted media.
   * @param productMedia - The array of media objects.
   * @param productId - The ID of the product to assign the media.
   * @returns A promise that resolves when all media has been assigned.
   */
  public async productMediaAssign(
    productMedia: mediaDto[],
    productId: string,
  ): Promise<void> {
    const validMediaUrls = productMedia.filter(
      (image) => image.medium && stringValidation(image.medium),
    );

    const createMediaPromises = validMediaUrls.map(async (image) => {
      if (image.medium && stringValidation(image.medium)) {
        await insertProductMediaById(image.medium, productId);
        const productMediaId = await fetchProductMediaId(
          image.medium,
          productId,
        );
        if (productMediaId) {
          this.productThumbnailsAssign(image, productMediaId);
        }
      }
    });

    await Promise.all(createMediaPromises);
    Logger.verbose(`Media added against product id: ${productId}`);
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

  /**
   * Assigns thumbnails to a given product media ID.
   * Validates the thumbnail URLs and inserts them into the database.
   * @param productMedia - The media object containing thumbnail URLs.
   * @param productMediaId - The ID of the product media to assign the thumbnails.
   */
  public async productThumbnailsAssign(
    productMedia: mediaDto,
    productMediaId: string,
  ): Promise<void> {
    const thumbnailSizes = [
      { size: '512', url: productMedia?.small },
      { size: '1024', url: productMedia?.large },
      { size: '256', url: productMedia?.tiny },
    ];

    const thumbnailPromises = thumbnailSizes
      .filter((thumbnail) => thumbnail.url && stringValidation(thumbnail.url))
      .map(async (thumbnail) => {
        if (thumbnail.url) {
          await insertThumbnailMediaById({
            mediaUrl: thumbnail.url,
            size: thumbnail.size,
            productId: productMediaId,
          });
        }
      });

    await Promise.all(thumbnailPromises);
    Logger.verbose(`Thumbnail added against: ${productMediaId}`);
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
      this.logger.log('Creating variant media against product id', productId);
      // getting media ids of each product color
      const mediaIds = await this.createVariantMedia(
        productVariantData.variant_media?.ColorMedia,
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

  /**
   * Create variant media for a product.
   *
   * @param productVariantMedia - Array of media objects containing color information.
   * @param productId - ID of the product.
   * @param defaultMediaId - ID of the default media.
   * @returns A Promise resolving to an object containing color-name to media-ID mappings.
   */
  public async createVariantMedia(
    productVariantMedia: MediaColorListInterface[],
    productId: string,
    defaultMediaId: string,
  ): Promise<{ [key: string]: string }> {
    // Object to store the color-name to media-ID mappings
    const mediaIds: { [key: string]: string } = {};

    // Process each media object asynchronously
    await Promise.all(
      productVariantMedia?.map(async (media) => {
        const url: string = media.color_image;

        // If the URL includes 'ColorSwatch', create media against that color
        if (url.includes('ColorSwatch')) {
          // Extract the colorSwatchUrl from the URL
          const colorSwatchUrl = url.split('ColorSwatch/')[1];

          // Construct the full path for the color swatch media
          const colorSwatchPath = `ColorSwatch/${colorSwatchUrl}`;

          // Decode the product ID if necessary
          const decodedProductId = idBase64Decode(productId);

          // Insert the product media using the color swatch path and decoded product ID
          await insertProductMediaById(colorSwatchPath, decodedProductId);

          // Fetch the media ID of the newly created color swatch media
          const productMediaId = await fetchProductMediaId(
            colorSwatchPath,
            decodedProductId,
          );

          // Store the media ID in the mediaIds object using the color name as the key
          mediaIds[media.color_name] = productMediaId;
        } else {
          // If the media already exists in the product scope, use the default media ID
          mediaIds[media.color_name] = defaultMediaId;
        }
      }),
    );

    // Return the mediaIds object
    return mediaIds;
  }
}
