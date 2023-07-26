/* eslint-disable prettier/prettier */
import { gql } from 'graphql-request';
import { CollectionCreateInput } from 'src/graphql/types/collection';

export const collectionCreateMutation = ({
  name,
  products,
  sourceId,
  masterImage,
  banner,
  listImage
}: CollectionCreateInput): string => {
  return gql`
    mutation {
      collectionCreate(
        input: {
          name: "${name}"
          products: ${JSON.stringify(products)}
          metadata: [{ key: "sourceId", value: "${sourceId}" }, { key: "masterImage", value: "${masterImage.replace(/"/g, "'")}" }
        ,{ key: "banner", value: "${banner}" }, { key: "listImage", value: "${listImage}" }]
        }
      ) {
        collection {
          id
          name
        }
        errors {
          message
        }
      }
    }
  `;
};
