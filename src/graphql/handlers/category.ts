import {
  insertMasterCategoryId,
  insertSubCategoryId,
} from 'src/postgres/handlers/category';
import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import {
  createCategoryMasterMutation,
  createCategorySubMutation,
} from '../mutations/category/create';
import { updateCategoryMutation } from '../mutations/category/update';

//  <-->  Create  <-->

export const createCategoryMasterHandler = async (categoryData) => {
  try {
    const createCategoryMaster = await graphqlCall(
      createCategoryMasterMutation(categoryData),
    );
    insertMasterCategoryId(
      categoryData.TBStyleNo_OS_Category_Master_ID,
      createCategoryMaster,
    );
    // console.log(createCategoryMaster);
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
    // console.log(createCategorySub);
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
    // console.log(updateCategory);
    return { ...updateCategory };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
