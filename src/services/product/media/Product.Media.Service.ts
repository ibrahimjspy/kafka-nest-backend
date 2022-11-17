import { Injectable } from '@nestjs/common';
import { insertProductMediaById } from 'src/database/postgres/handlers/media';
import { TransformerService } from 'src/transformer/Transformer.service';
/**
 *  Injectable class handling media assign
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductMediaService {
  constructor(private readonly transformerClass: TransformerService) {}

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
}
