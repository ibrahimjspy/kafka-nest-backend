import { gql } from 'graphql-request';

export const updateCategoryMutation = (categoryData, categoryId: string) => {
  const categoryName = categoryData.CategoryMasterName;
  const categorySlug = categoryData.slug;
  // const categoryDescription = categoryData.description;
  return gql`
    mutation {
      categoryUpdate(
        id:"${categoryId}"
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
