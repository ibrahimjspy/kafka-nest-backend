import { gql } from 'graphql-request';

export const deleteCategoryMutation = (categoryId: string) => {
  return gql`
    mutation {
      categoryDelete(id: "${categoryId}") {
        category {
          name
          description
          seoTitle
          seoDescription
        }
      }
    }
  `;
};
