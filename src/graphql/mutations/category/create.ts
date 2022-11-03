import { gql } from 'graphql-request';

export const createCategoryMasterMutation = (categoryData) => {
  const { name, seo_title, seo_description, description } = categoryData;
  return gql`
    mutation {
      categoryCreate(
        input: {
          name: "${name}"
          description:${JSON.stringify(description)}
          seo: { title: "${seo_title}", description: "${seo_description}" }
        }
      ) {
        category {
          id
        }
        errors{
          message
        }
      }
    }
  `;
};

export const createCategorySubMutation = (categoryData, MasterId) => {
  const { name, seo_title, seo_description, description } = categoryData;
  return gql`
    mutation {
      categoryCreate(
        parent:"${MasterId}"
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
