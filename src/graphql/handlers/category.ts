import {
  deleteMasterCategoryId,
  deleteSubCategoryId,
  insertMasterCategoryId,
  insertSubCategoryId,
} from 'src/postgres/handlers/category';
import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import {
  createCategoryMasterMutation,
  createCategorySubMutation,
} from '../mutations/category/create';
import { deleteCategoryMutation } from '../mutations/category/delete';
import { updateCategoryMutation } from '../mutations/category/update';

//  <-->  Create  <-->

export const createCategoryMasterHandler = async (categoryData) => {
  try {
    console.log(categoryData, 'category data');
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
  categoryData,
  masterId: string,
) => {
  try {
    const createCategorySub = await graphqlCall(
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

export const updateCategoryHandler = async (
  categoryData: object,
  categoryId: string,
) => {
  try {
    const updateCategory = await graphqlCall(
      updateCategoryMutation(categoryData, categoryId),
    );
    console.log(updateCategory);
    return { ...updateCategory };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Delete  <-->

export const deleteMasterCategoryHandler = async (categoryId) => {
  try {
    const data = await graphqlCall(deleteCategoryMutation(categoryId));
    await deleteMasterCategoryId(categoryId);
    console.log(data);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const deleteSubCategoryHandler = async (categoryId) => {
  try {
    const data = await graphqlCall(deleteCategoryMutation(categoryId));
    await deleteSubCategoryId(categoryId);
    console.log(data);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
