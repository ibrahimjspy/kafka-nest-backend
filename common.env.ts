import * as dotenv from 'dotenv';
dotenv.config();
// file storing common env configurations
dotenv.config();

export const BATCH_SIZE = Number(process.env.BATCH_SIZE) || 10;
export const SALEOR_ENDPOINT = process.env.FEDERATION_ENDPOINT;
export const FEDERATION_ENDPOINT = process.env.DESTINATION_FEDERATION_ENDPOINT;
export const KAFKA_BROKER_ENDPOINT = process.env.KAFKA_BROKER;
export const ID_MAPPING_URL = process.env.MAPPING_URL;
export const ID_MAPPING_TOKEN = process.env.MAPPING_TOKEN;
export const CATEGORY_ENGINE = process.env.CATEGORY_ENGINE;
export const PRODUCT_ENGINE = process.env.PRODUCT_ENGINE;
export const SHOP_ENGINE = process.env.SHOP_ENGINE;
export const COST_ATTRIBUTE_ID =
  process.env.COST_ATTRIBUTE_ID || 'QXR0cmlidXRlOjU=';
export const DEFAULT_WAREHOUSE_ID =
  process.env.DEFAULT_WAREHOUSE_ID ||
  ' V2FyZWhvdXNlOjFlYTNkZGEzLTU4MTgtNGQ5OS05NjkyLWNhMWViM2YyMDNmNg==';
export const COLOR_ATTRIBUTE_ID =
  process.env.DEFAULT_COLOR_ATTRIBUTE_ID || 'QXR0cmlidXRlOjE3';
export const SIZE_ATTRIBUTE_ID =
  process.env.DEFAULT_SIZE_ATTRIBUTE_ID || 'QXR0cmlidXRlOjE4';
export const COMMISSION_ATTRIBUTE_ID =
  process.env.DEFAULT_COMMISSION_ATTRIBUTE_ID || 'QXR0cmlidXRlOjQ=';
export const DEFAULT_CHANNEL_ID =
  process.env.DEFAULT_CHANNEL_ID || 'Q2hhbm5lbDox';
export const DEFAULT_PRODUCT_TYPE =
  process.env.DEFAULT_PRODUCT_TYPE || 'UHJvZHVjdFR5cGU6Mg==';
export const STYLE_ATTRIBUTE_ID =
  process.env.STYLE_ATTRIBUTE_ID || 'QXR0cmlidXRlOjU=';
export const MANAGER_TYPE = process.env.DEFAULT_MANAGER_TYPE || '1';
export const SHIPPING_ZONE_ID =
  process.env.SHIPPING_ZONE_ID || 'U2hpcHBpbmdab25lOjE=';
export const AUTHORIZATION_HEADER_APP = process.env.AUTHORIZATION_HEADER;
export const DEFAULT_SHIPPING_METHOD =
  process.env.DEFAULT_SHIPPING_METHOD || 'U2hpcHBpbmdNZXRob2RUeXBlOjE=';
export const DEFAULT_MASTER_CATEGORY_ID =
  process.env.DEFAULT_CATEGORY_ID || 'Q2F0ZWdvcnk6MTM=';
export const DEFAULT_CATEGORY_ID =
  process.env.DEFAULT_CATEGORY_ID || 'Q2F0ZWdvcnk6MQ==';
export const DEFAULT_SHOP_ID = process.env.DEFAULT_SHOP_ID || '16';
export const S3_VENDOR_URL = process.env.S3_VENDOR_URL;
export const KAFKA_CONSUMER_GROUP = process.env.KAFKA_CONSUMER_GROUP;
export const SERVER_PORT = process.env.SERVER_PORT;
export const RESALE_PRICE_ATTRIBUTE =
  process.env.RESALE_PRICE_ATTRIBUTE || 'QXR0cmlidXRlOjg=';
export const AUTO_SYNC_URL = process.env.AUTO_SYNC_URL;
export const ADMIN_EMAIL = 'dev@orangeshine.com';
