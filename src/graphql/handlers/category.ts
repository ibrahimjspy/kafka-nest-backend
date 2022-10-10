import {
  deleteMasterCategoryId,
  deleteSubCategoryId,
  insertMasterCategoryId,
  insertSubCategoryId,
} from 'src/postgres/handlers/category';
import { masterCategoryCDC, subCategoryCDC } from 'src/types/Category';
import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
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

export const createCategoryMasterHandler = async (
  categoryData: masterCategoryCDC,
): Promise<object> => {
  try {
    // console.log(categoryData, 'category data');
    const createCategoryMaster = await graphqlCall(
      createCategoryMasterMutation(categoryData),
    );
    await insertMasterCategoryId(
      categoryData.TBStyleNo_OS_Category_Master_ID,
      createCategoryMaster,
    );
    console.log(createCategoryMaster);
    return { ...createCategoryMaster };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const createCategorySubHandler = async (
  categoryData: subCategoryCDC,
  masterId: string,
): Promise<object> => {
  try {
    const createCategorySub: object = await graphqlCall(
      createCategorySubMutation(categoryData, masterId),
    );
    insertSubCategoryId(
      categoryData.TBStyleNo_OS_Category_Sub_ID,
      createCategorySub,
    );
    console.log(createCategorySub);
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
    console.log(updateCategory);
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
    console.log(updateCategory);
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
    await deleteMasterCategoryId(categoryId);
    console.log(data);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const deleteSubCategoryHandler = async (
  categoryId: string,
): Promise<object> => {
  try {
    const data: object = await graphqlCall(deleteCategoryMutation(categoryId));
    await deleteSubCategoryId(categoryId);
    console.log(data);
    return data;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
