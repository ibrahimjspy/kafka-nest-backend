import { Injectable } from '@nestjs/common';
import { createProductMediaHandler } from 'src/graphql/handlers/media';
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
        await createProductMediaHandler(url, productId);
      }),
    );
    return createMedia;
  }
}
