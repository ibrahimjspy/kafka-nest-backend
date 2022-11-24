import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { stringValidation } from 'src/app.utils';
import {
  fetchProductMediaId,
  insertProductMediaById,
  insertThumbnailMediaById,
} from 'src/database/postgres/handlers/media';
import { getProductDetailsHandler } from 'src/graphql/handlers/product';
import { mediaDto, productTransformed } from 'src/transformer/types/product';
import { ProductService } from '../Product.Service';
import { mediaUrlMapping } from '../Product.utils';
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
        if (image.large) {
          if (stringValidation(image.large)) {
            // create standard media
            await insertProductMediaById(image.large, productId);
            const productMediaId = await fetchProductMediaId(
              image.large,
              productId,
            );
            // create thumbnails
            if (image.medium && image.small && image.tiny) {
              await this.productThumbnailsAssign(image, productMediaId);
            }
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
    const createSmallImage = await insertThumbnailMediaById({
      mediaUrl: productMedia.small,
      size: '116',
      productId: productMediaId,
    });
    const createMediumImage = await insertThumbnailMediaById({
      mediaUrl: productMedia.medium,
      size: '232',
      productId: productMediaId,
    });
    const createTinyImage = await insertThumbnailMediaById({
      mediaUrl: productMedia.tiny,
      size: '56',
      productId: productMediaId,
    });
    return { createSmallImage, createMediumImage, createTinyImage };
  }
}
