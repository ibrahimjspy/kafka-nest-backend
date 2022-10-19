import { Injectable } from '@nestjs/common';
import { createProductMedia } from 'src/graphql/handlers/media';
import { TransformerService } from 'src/services/transformer/Service';
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
    const createMedia = await media.map(async (url) => {
      // console.log(url);
      await createProductMedia(url, productId);
    });
    return createMedia;
  }
}
