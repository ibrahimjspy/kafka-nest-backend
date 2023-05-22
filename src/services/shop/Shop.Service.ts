import { Injectable, Param } from '@nestjs/common';
import {
  createShopHandler,
  deleteShopHandler,
  updateShopHandler,
} from 'src/graphql/handlers/shop';
import { TransformerService } from 'src/transformer/Transformer.service';
import { shopDto, shopTransformed } from 'src/transformer/types/shop';
import { fetchBulkVendorShipping } from 'src/database/mssql/bulk-import/methods';
import { fetchShippingMethodId } from 'src/database/postgres/handlers/shippingMethods';
import { addShippingMethodHandler } from 'src/graphql/handlers/shippingMethod';
import { shippingMethodValidation } from './Shop.utils';
import { UserService } from './user/User.Service';
import {
  addShopMapping,
  getShopMapping,
  removeShopMapping,
} from 'src/mapping/methods/shop';
import { DEFAULT_SHIPPING_METHOD } from '../../../common.env';
import { fetchVendorPickupById } from 'src/database/mssql/api_methods/getVendorPickup';
import { addShippingZoneHandler } from 'src/graphql/handlers/shippingZone';

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

  public async handleShopCDC(@Param() kafkaMessage: shopDto): Promise<any> {
    const shopData: shopTransformed =
      await this.transformerService.shopTransformer(kafkaMessage);

    const mappingExists: string = await getShopMapping(
      kafkaMessage.TBVendor_ID,
    );
    if (mappingExists) {
      // updates shop and user information
      return await this.updateShop(shopData, mappingExists);
    }
    // creates new users and shop
    return await this.createShop(shopData);
  }

  public async handleShopCDCDelete(
    @Param() kafkaMessage: shopDto,
  ): Promise<object> {
    const shopExistsInDestination: string = await getShopMapping(
      kafkaMessage.TBVendor_ID,
    );
    // deactivates shop if it exists
    if (shopExistsInDestination) {
      await deleteShopHandler(shopExistsInDestination);
      await removeShopMapping(shopExistsInDestination);
    }
    return;
  }

  private async createShop(
    @Param() shopData: shopTransformed,
  ): Promise<object> {
    // creates new shop and map its id in mapping service
    const shop = await createShopHandler(shopData);
    shop && (await addShopMapping(shopData.id, shop));

    return { shop };
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

  private async addShippingZoneToShop(
    shopData: shopTransformed,
    destinationId: string,
  ) {
    const sourceShippingZoneDetails: any = await fetchVendorPickupById(
      shopData.id,
    );
    if (sourceShippingZoneDetails) {
      const shippingZoneTransformed =
        this.transformerService.shopShippingZoneTransformer(
          sourceShippingZoneDetails,
        );
      await addShippingZoneHandler(
        destinationId,
        shippingZoneTransformed.zoneId,
      );
      return shippingZoneTransformed;
    }
    return;
  }
}
