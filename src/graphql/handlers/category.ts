import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { createProductCategoryMutation } from '../mutations/category';

//  <-->  Create  <-->

export const createCategoryHandler = async (categoryData: object) => {
  try {
    const createProduct = await graphqlCall(
      createProductCategoryMutation(categoryData),
    );
    console.log(createProduct);
    return { ...createProduct };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//   <-->  Update  <-->
