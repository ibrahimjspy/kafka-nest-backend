import { gql } from 'graphql-request';

export const createSalesMutation = (productName, saleAmount, variantIds) => {
  return gql`
    mutation {
      saleCreate(
        input: {
          name: "${productName}"
          type: FIXED
          value: ${saleAmount}
          variants: ${JSON.stringify(variantIds)}
        }
      ) {
        sale {
          id
          name
        }
        errors {
          field
          message
        }
      }
    }
  `;
};

export const addSaleToChannelMutation = (saleId, saleAmount) => {
  const DEFAULT_CHANNEL = 'Q2hhbm5lbDox';
  return gql`
    mutation {
      saleChannelListingUpdate(
        id: "${saleId}"
        input: {
          addChannels: [{ channelId: "${DEFAULT_CHANNEL}", discountValue: ${saleAmount} }]
        }
      ) {
        sale {
          id
        }
      }
    }
  `;
};
