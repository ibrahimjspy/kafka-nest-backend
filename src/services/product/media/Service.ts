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
    const media = await this.transformerClass.productMediaTransformer(
      productMedia,
    );
    const createMedia = Promise.all(
      media.map(async (url) => {
        const splitUrl = url.split('OS/');
        await insertProductMediaById(splitUrl[1], productId);
      }),
    );
    return createMedia;
  }
}
