import axios from 'axios';
import { ID_MAPPING_TOKEN, ID_MAPPING_URL } from '../../common.env';

/**
 * @returns mappings stored against an engine
 */
export const getMapping = async (engine, filter, currentPage = 1) => {
  const data = JSON.stringify({
    query: '',
    page: { size: 1000, current: currentPage },
    filters: {
      all: filter,
    },
  });
  return await axios({
    method: 'post',
    url: `${ID_MAPPING_URL}/${engine}/search`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer private-${ID_MAPPING_TOKEN}`,
    },
    data: data,
  })
    .then(function (response) {
      // handle success
      return response.data['results'];
    })
    .catch(function (error) {
      // handle error
      console.error(error);
    });
};

/**
 * @description this common util, takers an object of input defined according to elastic search protocol and adds it
 * against given engine
 */
export const insertMapping = async (engine: string, mappings: object) => {
  const data = JSON.stringify(mappings);

  return await axios({
    method: 'post',
    url: `${ID_MAPPING_URL}/${engine}/documents`,
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
      console.error(error);
    });
};

/**
 * @description this utility removes mapping against a particular mapping id  stored in given engine
 */
export const deleteMapping = async (engine: string, id: string) => {
  const data = [`${id}`];

  return await axios({
    method: 'delete',
    url: `${ID_MAPPING_URL}/${engine}/documents`,
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
      console.error(error);
    });
};

/**
 * @description this common util, takers an object of input defined according to elastic search protocol and adds it
 * against given engine
 */
export const updateMapping = async (engine: string, mappings: object) => {
  const data = JSON.stringify(mappings);

  return await axios({
    method: 'patch',
    url: `${ID_MAPPING_URL}/${engine}/documents`,
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
      console.error(error);
    });
};
