import { gql } from 'graphql-request';
// import { descriptionTransformer } from 'src/transformers/productGeneral';

export const createCategoryMasterMutation = (categoryData) => {
  console.log(categoryData);
  const categoryName = categoryData.CategoryMasterName;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createCategorySubMutation = (categoryData, MasterId) => {
  const categoryName = categoryData.CategorySubName;
  // const categoryDescription = descriptionTransformer(categoryData.Description);
  return gql`
    mutation {
      categoryCreate(
        parent:"Q2F0ZWdvcnk6NTE="
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
