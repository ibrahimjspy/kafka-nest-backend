import { gql } from 'graphql-request';

export const createProductCategoryMutation = (categoryData) => {
  return gql`
    mutation{
    categoryCreate(
    input: {
      name:${categoryData.category.master.name}
      slug:${categoryData.category.master.slug_name}
    }
  )
} `;
};

export const createProductCategoryMutationChild = (categoryData, productId) => {
  return gql`
      mutation{
      categoryCreate(
      input: {
      name:${categoryData.category.master.name}
      slug:${categoryData.category.master.slug_name}
    }
    parent:${productId}
    )
  } `;
};
