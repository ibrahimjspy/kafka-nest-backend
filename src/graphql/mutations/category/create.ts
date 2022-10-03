import { gql } from 'graphql-request';

export const createCategoryMasterMutation = (categoryData) => {
  const categoryName = categoryData.CategoryMasterName;
  const categorySlug = categoryData.slug;
  // const categoryDescription = categoryData.description;
  return gql`
    mutation {
      categoryCreate(
        input: {
          name: "${categoryName}"
          slug: "${categorySlug}"
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
  const categoryName = categoryData.CategoryMasterName;
  const categorySlug = categoryData.slug;
  // const categoryDescription = categoryData.description;
  return gql`
    mutation {
      categoryCreate(
        parent:"${MasterId}"
        input: {
          name: "${categoryName}"
          slug: "${categorySlug}"
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
