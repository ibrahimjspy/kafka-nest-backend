import { Injectable, Logger, Param } from '@nestjs/common';
import {
  createShopHandler,
  deleteShopHandler,
  getShopHandler,
  updateShopHandler,
} from 'src/graphql/handlers/shop';
import { TransformerService } from 'src/transformer/Transformer.service';
import { shopDto, shopTransformed } from 'src/transformer/types/shop';
import {
  fetchBulkVendorShipping,
  fetchVendor,
} from 'src/database/mssql/bulk-import/methods';
import { fetchShippingMethodId } from 'src/database/postgres/handlers/shippingMethods';
import { addShippingMethodHandler } from 'src/graphql/handlers/shippingMethod';
import { getDestinationShopType, shippingMethodValidation } from './Shop.utils';
import { UserService } from './user/User.Service';
import {
  addShopMapping,
  getShopMapping,
  removeShopMapping,
  updateShopMapping,
} from 'src/mapping/methods/shop';
import { DEFAULT_SHIPPING_METHOD } from '../../../common.env';
import { fetchVendorPickupById } from 'src/database/mssql/api_methods/getVendorPickup';
import { addShippingZoneHandler } from 'src/graphql/handlers/shippingZone';
import { syncVendorIds } from '../../../constants';
import { ProducerService } from 'src/kafka/Kafka.producer.service';
import { KAFKA_SYNC_VENDOR_PRODUCTS_TOPIC } from 'src/kafka/Kafka.constants';

/**
 *  Injectable class handling brand and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  constructor(
    private readonly transformerService: TransformerService,
    private readonly userService: UserService,
    private readonly kafkaService: ProducerService,
  ) {}

  public async handleShopCDC(@Param() kafkaMessage: shopDto): Promise<any> {
    const shopData: shopTransformed =
      await this.transformerService.shopTransformer(kafkaMessage);
    const { shopId, documentId } = await getShopMapping(
      kafkaMessage.TBVendor_ID,
    );
    if (shopId) {
      const updateMapping = await updateShopMapping(
        documentId,
        shopData,
        shopId,
      );
      this.logger.log('mapping updated', JSON.stringify(updateMapping));
      this.syncVendorProducts(shopData, shopId);
      return await this.updateShop(shopData, shopId);
    }
    // creates new users and shop
    return await this.createShop(shopData);
  }

  public async handleShopCDCDelete(
    @Param() kafkaMessage: shopDto,
  ): Promise<object> {
    const { shopId } = await getShopMapping(kafkaMessage.TBVendor_ID);
    // deactivates shop if it exists
    if (shopId) {
      await deleteShopHandler(shopId);
      await removeShopMapping(shopId);
    }
    return;
  }

  private async createShop(
    @Param() shopData: shopTransformed,
  ): Promise<object> {
    // creates new shop and map its id in mapping service
    const shop = await createShopHandler(shopData);
    if (shop) {
      await addShopMapping({
        shopName: shopData.name,
        sourceId: shopData.id,
        destinationId: shop,
        isPopular: shopData.isPopular,
        isSharoveFulfillment: shopData.flat,
        brandImage: shopData.vendorMainImage,
        banners: shopData.banners,
      });
    }

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
  /**
   *  validates whether given vendor is allowed in sharove based on sharove type flag in tb vendor table
   */
  public async validateSharoveVendor(
    @Param() vendorId: string,
  ): Promise<boolean> {
    try {
      this.logger.log('Validating vendor', vendorId);
      const vendorResponse = await fetchVendor(vendorId);
      if (syncVendorIds.includes(vendorResponse[0].TBVendor_ID)) return true;
      return vendorResponse[0].SharoveType !== null;
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   *  this method checks if vendor type has updated, if vendor type has updated it sends a
   */
  private async syncVendorProducts(
    shopData: shopTransformed,
    destinationId: string,
  ): Promise<void> {
    const shopType = shopData.type;
    const destinationData = await getShopHandler(destinationId);
    const destinationShopType = getDestinationShopType(destinationData);
    if (shopType !== destinationShopType) {
      if (destinationShopType == 'null' && !shopType) return;
      this.logger.log(
        'Sending kafka message to sync vendor products',
        shopData.id,
      );
      await this.kafkaService.produce({
        topic: KAFKA_SYNC_VENDOR_PRODUCTS_TOPIC,
        messages: [
          {
            value: JSON.stringify({ vendorId: shopData.id }),
          },
        ],
      });
    }
  }
}
