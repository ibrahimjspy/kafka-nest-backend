import { gql } from 'graphql-request';

export const metadataCheckQuery = (orangeShineId: string): string => {
  return gql`
    query {
      products(
        first: 5
        channel: "default-channel"
        filter: { metadata: { key: "OS_ID", value: "${orangeShineId}" } }
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;
};
