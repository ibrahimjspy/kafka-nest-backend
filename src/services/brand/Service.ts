import { Injectable } from '@nestjs/common';
import {
  createShopHandler,
  updateShopHandler,
} from 'src/graphql/handlers/shop';
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
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    const shopData = await this.transformerService.shopTransformer(
      kafkaMessage,
    );
    // console.log(categoryExistsInDestination);
    if (shopExistsInDestination) {
      return updateShopHandler(shopData, shopExistsInDestination);
    }
    return createShopHandler(shopData);
  }
}
