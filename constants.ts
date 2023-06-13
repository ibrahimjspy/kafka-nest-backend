import * as dotenv from 'dotenv';
dotenv.config();

export const syncVendorIds = process.env.SYNC_VENDOR_IDS.split(',') || [
  'AMM',
  '668',
  '737',
];
