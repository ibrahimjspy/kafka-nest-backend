import { SHIPPING_ZONE_ID } from 'common.env';
import { gql } from 'graphql-request';
import { shippingMethodDto } from 'src/transformer/types/shop';

export const createShippingMethodMutation = (
  shippingMethodData: shippingMethodDto,
) => {
  const { SMShipMethodName } = shippingMethodData;
  return gql`
        mutation {
        shippingPriceCreate(
            input: { name: "${SMShipMethodName}", shippingZone: "${SHIPPING_ZONE_ID}" type:PRICE }
        ) {
            shippingMethod {
            id
            }
            errors {
            message
            }
        }
        }
  `;
};
