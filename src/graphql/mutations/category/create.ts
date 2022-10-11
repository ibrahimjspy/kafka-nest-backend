import { gql } from 'graphql-request';
// import { descriptionTransformer } from 'src/transformers/productGeneral';

export const createCategoryMasterMutation = (categoryData) => {
  // console.log(categoryData);
  const { name, seo_title, seo_description } = categoryData;
  return gql`
    mutation {
      categoryCreate(
        input: {
          name: "${name}"
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createCategorySubMutation = (categoryData, MasterId) => {
  const { name, seo_title, seo_description } = categoryData;
  return gql`
    mutation {
      categoryCreate(
        parent:"Q2F0ZWdvcnk6NTE="
        input: {
          name: "${name}"
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
