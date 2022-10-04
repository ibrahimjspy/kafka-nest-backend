import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import {
  createCategoryMasterMutation,
  createCategorySubMutation,
} from '../mutations/category/create';
import { updateCategoryMutation } from '../mutations/category/update';

//  <-->  Create  <-->

export const createCategoryMasterHandler = async (categoryData: object) => {
  try {
    const createCategoryMaster = await graphqlCall(
      createCategoryMasterMutation(categoryData),
    );
    console.log(createCategoryMaster);
    return { ...createCategoryMaster };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const createCategorySubHandler = async (
  categoryData: object,
  masterId: string,
) => {
  try {
    const createCategorySub = await graphqlCall(
      createCategorySubMutation(categoryData, masterId),
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
