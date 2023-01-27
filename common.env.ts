import * as dotenv from 'dotenv';
dotenv.config();
// file storing common env configurations
export const SALEOR_ENDPOINT = process.env.DESTINATION_SALEOR_ENDPOINT;
export const FEDERATION_ENDPOINT = process.env.DESTINATION_FEDERATION_ENDPOINT;
export const KAFKA_BROKER_ENDPOINT = process.env.KAFKA_BROKER;
export const ID_MAPPING_URL = process.env.MAPPING_URL;
export const ID_MAPPING_TOKEN = process.env.MAPPING_TOKEN;
export const CATEGORY_ENGINE = process.env.CATEGORY_ENGINE;
export const PRODUCT_ENGINE = process.env.PRODUCT_ENGINE;
export const SHOP_ENGINE = process.env.SHOP_ENGINE;
export const COST_ATTRIBUTE_ID =
  process.env.COST_ATTRIBUTE_ID || 'QXR0cmlidXRlOjU=';
