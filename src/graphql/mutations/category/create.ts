import { gql } from 'graphql-request';

export const createCategoryMasterMutation = (categoryData) => {
  const categoryName = categoryData.CategoryMasterName;
  // const categoryDescription = categoryData.Description;
  return gql`
    mutation {
      categoryCreate(
        input: {
          name: "${categoryName}"
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

export const createCategorySubMutation = (categoryData, MasterId) => {
  const categoryName = categoryData.CategorySubName;
  // const categoryDescription = categoryData.Description;
  return gql`
    mutation {
      categoryCreate(
        parent:"${MasterId}"
        input: {
          name: "${categoryName}"
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
