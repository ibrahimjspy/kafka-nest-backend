import { Injectable } from '@nestjs/common';
import {
  fetchShippingMethodId,
  insertShippingMethodId,
} from 'src/database/postgres/handlers/shippingMethods';
import { createShippingMethodHandler } from 'src/graphql/handlers/shippingMethod';
import { shippingMethodDto } from 'src/transformer/types/shop';
@Injectable()
export class ShippingService {
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
}
