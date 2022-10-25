import { Injectable, Param } from '@nestjs/common';
import {
  createShopHandler,
  deleteShopHandler,
  updateShopHandler,
} from 'src/graphql/handlers/shop';
import {
  createUserHandler,
  deleteUserHandler,
  updateUserHandler,
} from 'src/graphql/handlers/user';
import {
  deleteShopId,
  fetchShopId,
  insertShopId,
} from 'src/postgres/handlers/shop';
import {
  deleteUserId,
  fetchUserId,
  insertUserId,
} from 'src/postgres/handlers/user';
import { TransformerService } from 'src/transformer/Transformer.service';
import { shopDto, shopTransformed } from 'src/types/shop';

/**
 *  Injectable class handling brand and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ShopService {
  constructor(private readonly transformerService: TransformerService) {}

  public healthCheck(): string {
    return 'Service running';
  }

  public async handleShopCDC(@Param() kafkaMessage: shopDto): Promise<object> {
    const shopExistsInDestination: string = await fetchShopId(
      kafkaMessage.TBVendor_ID,
    );
    const shopData: shopTransformed =
      await this.transformerService.shopTransformer(kafkaMessage);

    if (shopExistsInDestination) {
      // updates shop and user information
      return this.updateShop(shopData, shopExistsInDestination);
    }

    // creates new users and shop
    return this.createShop(shopData);
  }

  public async handleShopCDCDelete(
    @Param() kafkaMessage: shopDto,
  ): Promise<object> {
    const shopExistsInDestination: string = await fetchShopId(
      kafkaMessage.TBVendor_ID,
    );
    // deactivates shop if it exists
    if (shopExistsInDestination) {
      await deleteShopHandler(shopExistsInDestination);
      await deleteShopId(kafkaMessage.TBVendor_ID);
    }
    // deletes user if it exists
    const userExistsInDestination = await fetchUserId(kafkaMessage.TBVendor_ID);
    if (userExistsInDestination) {
      await deleteUserHandler(userExistsInDestination);
      await deleteUserId(kafkaMessage.TBVendor_ID);
    }

    return;
  }

  private async createShop(
    @Param() shopData: shopTransformed,
  ): Promise<object> {
    // creating new user and map its id in database
    const user = await createUserHandler(shopData);
    const userIdMapping = await insertUserId(shopData.id, user);

    // creates new shop and map its id in database
    const shop = await createShopHandler(shopData, user);
    const shopIdMapping = await insertShopId(shopData.id, shop);

    return { user, shop, userIdMapping, shopIdMapping };
  }

  private async updateShop(
    shopData: shopTransformed,
    shopId: string,
  ): Promise<object> {
    // updates user and shop
    const userId = await fetchUserId(shopData.id);
    const updateUser = await updateUserHandler(shopData, userId);
    const updateShop = await updateShopHandler(shopData, shopId);
    return { updateUser, updateShop };
  }
}
