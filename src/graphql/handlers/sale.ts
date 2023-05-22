import {
  addSaleToChannelMutation,
  createSalesMutation,
} from '../mutations/sale/create';
import { graphqlCall, graphqlExceptionHandler } from '../utils/call';

export const createSalesHandler = async (
  productName,
  saleAmount,
  variantIDs,
): Promise<object> => {
  try {
    const createSale = await graphqlCall(
      createSalesMutation(productName, saleAmount, variantIDs),
    );
    await graphqlCall(
      addSaleToChannelMutation(createSale['saleCreate'].sale.id, saleAmount),
    );
    return createSale;
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
