import { Injectable } from '@nestjs/common';
import { insertProductMediaById } from 'src/postgres/handlers/media';
import { TransformerService } from 'src/transformer/Transformer.service';
/**
 *  Injectable class handling media assign
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductMediaService {
  constructor(private readonly transformerClass: TransformerService) {}

  public healthCheck(): string {
    return 'Service running';
  }
  public async productMediaAssign(productMedia, productId) {
    const createMedia = Promise.all(
      productMedia.map(async (url) => {
        if (url) {
          await insertProductMediaById(url, productId);
        }
      }),
    );
    return createMedia;
  }
}
