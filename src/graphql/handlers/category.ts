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
import { CollectionCreateInput } from '../types/collection';
import { collectionCreateMutation } from '../mutations/collections/create';

//  <-->  Create  <-->

export const createMasterCategoryHandler = async (
  categoryData: masterCategoryTransformed,
): Promise<string> => {
  try {
    const createCategoryMaster = await graphqlCall(
      createCategoryMasterMutation(categoryData),
    );
    Logger.verbose('Category created', createCategoryMaster);
    const categoryId = createCategoryMaster['categoryCreate']?.category?.id;
    return categoryId;
  } catch (err) {
    graphqlExceptionHandler(err);
    return;
  }
};

export const createSubCategoryHandler = async (
  categoryData: subCategoryTransformed,
  masterId: string,
): Promise<string> => {
  try {
    const createCategorySub: object = await graphqlCall(
      createCategorySubMutation(categoryData, masterId),
    );
    Logger.verbose('Category created', createCategorySub);
    const categoryId = createCategorySub['categoryCreate']?.category?.id;

    return categoryId;
  } catch (err) {
    graphqlExceptionHandler(err);
    return;
  }
};

export const createCollectionHandler = async (
  collectionCreateInput: CollectionCreateInput,
): Promise<object> => {
  try {
    const createCollection = await graphqlCall(
      collectionCreateMutation(collectionCreateInput),
    );
    Logger.verbose('Collection created', createCollection);
    return createCollection;
  } catch (err) {
    graphqlExceptionHandler(err);
    return;
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
