/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IS_SHAROVE_FULFILLMENT, PATTERNS_ATTRIBUTE_ID, SLEEVES_ATTRIBUTE_ID, STYLES_ATTRIBUTE_ID, STYLE_ATTRIBUTE_ID } from 'common.env';
import { gql } from 'graphql-request';
import { productTransformed } from 'src/transformer/types/product';

export const updateProductMutation = (
  productData: productTransformed,
  destinationId,
) => {
  const { id, name, description, categoryId, styleNumber, isSharoveFulfillment, patterns, sleeves, styles } = productData;
  return gql`
    mutation{
      productUpdate(
        id:"${destinationId}" 
        input:{
        category:"${categoryId}"
        name:"${name}"
        externalReference:"${id}"
        description:${JSON.stringify(description)}
        attributes:[{
          id:"${STYLE_ATTRIBUTE_ID}",
          values:["${styleNumber}"]
        },
        {
          id:"${IS_SHAROVE_FULFILLMENT}",
          boolean:${isSharoveFulfillment}
        },
        ${patterns ? `{
          id:"${PATTERNS_ATTRIBUTE_ID}",
          multiselect: ${JSON.stringify(patterns).replace(/"value"/g, 'value')}
        }` : ""},
        ${sleeves? `{
          id:"${SLEEVES_ATTRIBUTE_ID}",
          multiselect: ${JSON.stringify(sleeves).replace(/"value"/g, 'value')}
        }`: ''},
        ${styles ? `{
          id:"${STYLES_ATTRIBUTE_ID}",
          multiselect: ${JSON.stringify(styles).replace(/"value"/g, 'value')}
        }`: ''}
      ]
      }){
    product{
      name
      id
      rating
    }
   }
    }
`;
};
