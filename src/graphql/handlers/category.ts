import { Logger } from '@nestjs/common';
import {
  masterCategoryTransformed,
  subCategoryTransformed,
} from 'src/transformer/types/category';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import {
  createCategoryMasterMutation,
  createCategorySubMutation,
} from '../mutations/category/create';
import { deleteCategoryMutation } from '../mutations/category/delete';
import {
  updateMasterCategoryMutation,
  updateSubCategoryMutation,
} from '../mutations/category/update';

//  <-->  Create  <-->

export const createMasterCategoryHandler = async (
  categoryData: masterCategoryTransformed,
): Promise<object> => {
  try {
    const createCategoryMaster = await graphqlCall(
      createCategoryMasterMutation(categoryData),
    );
    Logger.verbose('Category created', createCategoryMaster);
    return { ...createCategoryMaster };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const createSubCategoryHandler = async (
  categoryData: subCategoryTransformed,
  masterId: string,
): Promise<object> => {
  try {
    const createCategorySub: object = await graphqlCall(
      createCategorySubMutation(categoryData, masterId),
    );
    Logger.verbose('Category created', createCategorySub);
    return { ...createCategorySub };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//   <-->  Update  <-->

export const updateMasterCategoryHandler = async (
  categoryData: object,
  categoryId: string,
): Promise<object> => {
  try {
    const updateCategory: object = await graphqlCall(
      updateMasterCategoryMutation(categoryData, categoryId),
    );
    Logger.log('Category updated', updateCategory);
    return { ...updateCategory };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const updateSubCategoryHandler = async (
  categoryData: object,
  categoryId: string,
): Promise<object> => {
  try {
    const updateCategory: object = await graphqlCall(
      updateSubCategoryMutation(categoryData, categoryId),
    );
    Logger.log('Category updated', updateCategory);
    return { ...updateCategory };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Delete  <-->

export const deleteMasterCategoryHandler = async (
  categoryId: string,
): Promise<object> => {
  try {
    const data: object = await graphqlCall(deleteCategoryMutation(categoryId));
    Logger.warn('Category deleted', data);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const deleteSubCategoryHandler = async (
  categoryId: string,
): Promise<object> => {
  try {
    const data: object = await graphqlCall(deleteCategoryMutation(categoryId));
    Logger.warn('Category deleted', data);
    return data;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
