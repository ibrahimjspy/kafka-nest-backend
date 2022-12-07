/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { ID_MAPPING_TOKEN, ID_MAPPING_URL } from '../../common.env';

/**
 * @returns product information in destination according to source Id
 */
export const getProductMapping = async (sourceId: string) => {
  const data = JSON.stringify({
    query: '',
    filters: {
      all: [
        {
          os_product_id: `${sourceId}`,
        },
      ],
    },
  });

  return await axios({
    method: 'post',
    url: `${ID_MAPPING_URL}/search`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer private-${ID_MAPPING_TOKEN}`,
    },
    data: data,
  })
    .then(function (response) {
      // handle success
      return response.data['results'][0]?.shr_b2b_product_id?.raw;
    })
    .catch(function (error) {
      // handle error
      console.error(error);
    });
};

/**
 * @posts product information in destination according to source Id
 */
export const addProductMapping = async (sourceId, destinationId, shopId) => {
  const data = JSON.stringify({
    os_product_id: sourceId,
    shr_b2b_product_id: destinationId,
    tenant_id: shopId,
  });

  return await axios({
    method: 'post',
    url: `${ID_MAPPING_URL}/documents`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer private-${ID_MAPPING_TOKEN}`,
    },
    data: data,
  })
    .then(function (response) {
      // handle success
      return response.data;
    })
    .catch(function (error) {
      // handle error
      Logger.error(error);
    });
};

/**
 * @deletes product information in destination according to source Id
 */
export const removeProductMapping = async (destinationId: string) => {
  return await axios
    .delete('https://catfact.ninja/fact')
    .then(function (response) {
      // handle success
      return response.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
};
