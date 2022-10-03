import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import {
  createCategoryMasterMutation,
  createCategorySubMutation,
} from '../mutations/category/create';

//  <-->  Create  <-->

export const createCategoryMasterHandler = async (categoryData: object) => {
  try {
    const createProduct = await graphqlCall(
      createCategoryMasterMutation(categoryData),
    );
    console.log(createProduct);
    return { ...createProduct };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const createCategorySubHandler = async (
  categoryData: object,
  masterId: string,
) => {
  try {
    const createProduct = await graphqlCall(
      createCategorySubMutation(categoryData, masterId),
    );
    console.log(createProduct);
    return { ...createProduct };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//   <-->  Update  <-->
