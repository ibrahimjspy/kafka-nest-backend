import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { insertProductMediaById } from 'src/database/postgres/handlers/media';
import { ProductService } from '../Product.Service';
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

  public async productMediaAssign(productMedia, productId) {
    // Validating media url and inserting it to DB
    const createMedia = Promise.all(
      productMedia.map(async (url) => {
        if (url) {
          if (url.length > 2) {
            await insertProductMediaById(url, productId);
          }
        }
      }),
    );
    return createMedia;
  }

  public async productMediaUpdate(
    destinationMedia,
    sourceMedia,
    destinationId,
  ) {
    if (destinationMedia === 0) {
      await this.productClass.createProductMedia(destinationId, sourceMedia);
      if (sourceMedia === 0) {
        return await this.productClass.productDelete(destinationId);
      }
    }
  }
}
