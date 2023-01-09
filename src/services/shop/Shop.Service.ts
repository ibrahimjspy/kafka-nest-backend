import { Injectable, Param } from '@nestjs/common';
import {
  createShopHandler,
  deleteShopHandler,
  updateShopHandler,
} from 'src/graphql/handlers/shop';
import { deleteUserHandler } from 'src/graphql/handlers/user';
import {
  deleteShopId,
  fetchShopId,
  insertShopId,
} from 'src/database/postgres/handlers/shop';
import { deleteUserId, fetchUserId } from 'src/database/postgres/handlers/user';
import { TransformerService } from 'src/transformer/Transformer.service';
import { shopDto, shopTransformed } from 'src/transformer/types/shop';
import { fetchBulkVendorShipping } from 'src/database/mssql/bulk-import/methods';
import { fetchShippingMethodId } from 'src/database/postgres/handlers/shippingMethods';
import { addShippingMethodHandler } from 'src/graphql/handlers/shippingMethod';
import { shippingMethodValidation } from './Shop.utils';
import { UserService } from './user/User.Service';

/**
 *  Injectable class handling brand and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ShopService {
  constructor(
    private readonly transformerService: TransformerService,
    private readonly userService: UserService,
  ) {}

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
    // creates new shop and map its id in database
    const shop = await createShopHandler(shopData);
    const shopIdMapping = await insertShopId(shopData.id, shop);

    return { shop, shopIdMapping };
  }

  private async updateShop(
    shopData: shopTransformed,
    shopId: string,
  ): Promise<object> {
    // updates user and shop
    const updateShop = await updateShopHandler(shopData, shopId);
    return { updateShop };
  }

  private async addShippingMethodToShop(sourceId: string, destinationId) {
    const shippingMethodIds = [];
    const DEFAULT_SHIPPING_METHOD =
      process.env.DEFAULT_SHIPPING_METHOD || 'U2hpcHBpbmdNZXRob2RUeXBlOjE=';
    const sourceShippingDetails: any = await fetchBulkVendorShipping(sourceId);

    if (sourceShippingDetails) {
      await Promise.all(
        sourceShippingDetails?.map(async (shippingMethod) => {
          const id = await fetchShippingMethodId(
            shippingMethod.TBShipMethod_ID,
          );
          if (id) {
            shippingMethodIds.push(id);
          }
        }),
      );
    }

    const data = await addShippingMethodHandler(
      destinationId,
      shippingMethodValidation(shippingMethodIds, DEFAULT_SHIPPING_METHOD),
    );
    return data;
  }
}
