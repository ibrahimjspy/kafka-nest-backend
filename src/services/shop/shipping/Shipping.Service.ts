import { Injectable } from '@nestjs/common';
import {
  fetchShippingMethodId,
  insertShippingMethodId,
} from 'src/database/postgres/handlers/shippingMethods';
import { createShippingMethodHandler } from 'src/graphql/handlers/shippingMethod';
import { shippingMethodDto } from 'src/transformer/types/shop';
@Injectable()
export class ShippingService {
  public async createShippingMethods(
    shippingMethodObject: shippingMethodDto,
  ): Promise<void> {
    const destinationId = await fetchShippingMethodId(
      shippingMethodObject.TBShipMethod_ID,
    );
    if (destinationId) {
      return;
    }

    const shippingMethodId = await createShippingMethodHandler(
      shippingMethodObject,
    );
    if (shippingMethodId) {
      await insertShippingMethodId(
        shippingMethodObject.TBShipMethod_ID,
        shippingMethodId,
      );
    }
    return;
  }
}
