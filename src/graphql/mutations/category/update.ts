import { gql } from 'graphql-request';

export const updateMasterCategoryMutation = (
  categoryData,
  categoryId: string,
) => {
  const categoryName = categoryData.CategoryMasterName;
  // const categoryDescription = categoryData.description;
  return gql`
    mutation {
      categoryUpdate(
        id:"${categoryId}"
        input: {
          name:"${categoryName}"
          seo: { title: "${categoryData.seo_title}", description: "${categoryData.seo_description}" }
        }
      ) {
        category {
          id
        }
      }
    }
  `;
};

export const updateSubCategoryMutation = (categoryData, categoryId: string) => {
  const categoryName = categoryData.CategorySubName;
  // const categoryDescription = categoryData.description;
  return gql`
    mutation {
      categoryUpdate(
        id:"${categoryId}"
        input: {
          name:"${categoryName}"
          seo: { title: "${categoryData.seo_title}", description: "${categoryData.seo_description}" }
        }
      ) {
        category {
          id
        }
      }
    }
  `;
};
