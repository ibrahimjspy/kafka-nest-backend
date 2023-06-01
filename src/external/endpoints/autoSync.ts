import { Logger } from '@nestjs/common';
import axios from 'axios';
import { AUTO_SYNC_URL } from 'common.env';

/**
 * Sends an auto-sync webhook request for a product.
 * @param {string} id - The ID of the b2b product.
 * @returns {Promise<any>} A promise that resolves to the response data.
 */
export const autoSyncWebhookHandler = async (id) => {
  try {
    const URL = `${AUTO_SYNC_URL}/api/v1/product`;
    const response = await axios.post(URL, { productId: id });
    return response.data;
  } catch (error) {
    Logger.error(error, error);
  }
};
