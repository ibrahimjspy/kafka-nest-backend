import { gql } from 'graphql-request';

export const updateMasterCategoryMutation = (
  categoryData,
  categoryId: string,
) => {
  const { name, seo_title, seo_description, description } = categoryData;
  return gql`
    mutation {
      categoryUpdate(
        id:"${categoryId}"
        input: {
          name: "${name}"
          description:${JSON.stringify(description)}
          seo: { title: "${seo_title}", description: "${seo_description}" }
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
  const { name, seo_title, seo_description, description } = categoryData;
  return gql`
    mutation {
      categoryUpdate(
        id:"${categoryId}"
        input: {
          name: "${name}"
          description:${JSON.stringify(description)}
          seo: { title: "${seo_title}", description: "${seo_description}" }
        }
      ) {
        category {
          id
        }
      }
    }
  `;
};
