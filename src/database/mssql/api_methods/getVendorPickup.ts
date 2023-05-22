import { shippingZoneDto } from 'src/transformer/types/shop';
import { mssqlCall } from '../bulk-import/fetch';
import { tbVendorSettingsQuery } from '../query';

export const fetchVendorPickupById = async (
  id: string,
): Promise<shippingZoneDto> => {
  const pickupZone = await mssqlCall(tbVendorSettingsQuery(id));
  if (pickupZone) {
    return pickupZone[0];
  }
  return null;
};
