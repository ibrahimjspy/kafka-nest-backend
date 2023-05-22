import { Logger } from '@nestjs/common';
import { deleteMapping, getMapping, insertMapping } from '../fetch';
import { CATEGORY_ENGINE } from '../../../common.env';
import { getIdByElement } from '../utils';

//                       <fetch>

export const getMasterCategoryMapping = async (sourceId: string) => {
  return getIdByElement(
    'shr_category_parent_id',
    await getMapping(CATEGORY_ENGINE, {
      os_category_master_id: sourceId,
    }),
  );
};

export const getSubCategoryMapping = async (
  sourceId: string,
  sourceMasterId: string,
) => {
  return getIdByElement(
    'shr_category_sub_id',
    await getMapping(CATEGORY_ENGINE, [
      {
        os_category_sub_id: sourceId,
      },
      {
        os_category_master_id: sourceMasterId,
      },
    ]),
  );
};

//                       <insert>

export const addMasterCategoryMapping = async (
  sourceId: string,
  destinationId: string,
) => {
  try {
    return await insertMapping(CATEGORY_ENGINE, {
      os_category_master_id: sourceId,
      shr_category_parent_id: destinationId,
    });
  } catch (error) {
    Logger.log('error');
  }
};

export const addSubCategoryMapping = async (
  sourceId: string,
  destinationId: string,
  destinationParentId: string,
  sourceMasterId: string,
) => {
  try {
    return await insertMapping(CATEGORY_ENGINE, {
      os_category_master_id: sourceMasterId,
      os_category_sub_id: sourceId,
      shr_category_sub_id: destinationId,
      shr_category_parent_id: destinationParentId,
    });
  } catch (error) {}
};

//                       <delete>

export const removeMasterCategoryMapping = async (destinationId) => {
  const id = await getMapping(CATEGORY_ENGINE, {
    shr_category_parent_id: destinationId,
  });
  return await deleteMapping(CATEGORY_ENGINE, getIdByElement('id', id));
};

export const removeSubCategoryMapping = async (destinationId) => {
  const id = await getMapping(CATEGORY_ENGINE, {
    shr_category_sub_id: destinationId,
  });
  return await deleteMapping(CATEGORY_ENGINE, getIdByElement('id', id));
};
