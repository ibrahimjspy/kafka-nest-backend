import { Injectable, Logger } from '@nestjs/common';
import {
  fetchShippingMethodId,
  insertShippingMethodId,
} from 'src/database/postgres/handlers/shippingMethods';
import { createShippingMethodHandler } from 'src/graphql/handlers/shippingMethod';
import { getDefaultShippingZoneHandler } from 'src/graphql/handlers/shippingZone';
import { shippingMethodDto } from 'src/transformer/types/shop';
@Injectable()
export class ShippingService {
  private cachedFlatShippingMethodIds: string[];
  private readonly logger = new Logger(ShippingService.name);

  /**
   * creates shipping methods through graphql api and store its mapping in database
   */
  public async createShippingMethods(
    shippingMethodObject: shippingMethodDto,
  ): Promise<void> {
    // checks mapping table iuf shopping method allready exists
    const destinationId = await fetchShippingMethodId(
      shippingMethodObject.TBShipMethod_ID,
    );
    if (destinationId) {
      return;
    }

    //creates shipping method thorough mutation
    const shippingMethodId = await createShippingMethodHandler(
      shippingMethodObject,
    );

    //stores its mapping in table
    if (shippingMethodId) {
      await insertShippingMethodId(
        shippingMethodObject.TBShipMethod_ID,
        shippingMethodId,
      );
    }
    return;
  }

  public async getFlatShippingMethodIds(): Promise<string[]> {
    if (!this.cachedFlatShippingMethodIds) {
      this.logger.log('Fetching shipping method with flat rate');
      const defaultShippingZone = await getDefaultShippingZoneHandler();
      const shippingMethodIds =
        defaultShippingZone?.edges[0]?.node?.shippingMethods
          .filter((shippingMethod) => {
            return shippingMethod.metadata.some((meta) => {
              return meta.key === 'is_flat' && meta.value === 'true';
            });
          })
          .map((shippingMethod) => shippingMethod.id);
      this.cachedFlatShippingMethodIds = shippingMethodIds;
      return this.cachedFlatShippingMethodIds;
    }
    return this.cachedFlatShippingMethodIds;
  }
}
