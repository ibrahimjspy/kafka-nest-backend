import { gql } from 'graphql-request';

export const shopDetailsQuery = (id: string): string => {
  const shopId = id ? `id: "${id}"` : '';
  return gql`
  query {
    marketplaceShop(filter: {
      ${shopId}
    }) {
        id
        name
        email
        url
        madeIn
        minOrder
        description
        about
        returnPolicy
        storePolicy
        shipsFrom
        fields {
          name
          values
        }
    }
  }
  `;
};
