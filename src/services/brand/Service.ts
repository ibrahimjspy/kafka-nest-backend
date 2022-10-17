import { Injectable } from '@nestjs/common';
import {
  createShopHandler,
  updateShopHandler,
} from 'src/graphql/handlers/shop';
import { createUserHandler } from 'src/graphql/handlers/user';
import { fetchShopId } from 'src/postgres/handlers/shop';
import { TransformerService } from 'src/services/transformer/Service';
/**
 *  Injectable class handling brand and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class BrandService {
  constructor(private readonly transformerService: TransformerService) {}

  public healthCheck(): string {
    return 'Service running';
  }

  public async handleShopCDC(kafkaMessage): Promise<object> {
    // console.log(kafkaMessage);
    const shopExistsInDestination: string = await fetchShopId(
      kafkaMessage.TBVendor_ID,
    );
    const shopData = await this.transformerService.shopTransformer(
      kafkaMessage,
    );
    // console.log(categoryExistsInDestination);
    if (shopExistsInDestination) {
      return updateShopHandler(shopData, shopExistsInDestination);
    }
    const user = await createUserHandler(shopData);
    return createShopHandler(shopData, user);
  }
}
