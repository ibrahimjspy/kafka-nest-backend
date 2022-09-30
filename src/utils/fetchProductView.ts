import sql from 'mssql';
import { testProductData } from '../../test/product';

/**
 * fetches source product and brand details against its product_id
 * @params productId,It must be a valid source product_id
 */
export const fetchAdditionalProductData = async (
  productId: string,
): Promise<object> => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(
      'Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true',
    );
    const result =
      await sql.query`select * from dbo.vTBStyleSearch where product_id = ${productId} FOR JSON AUTO GO`;
    if (result) {
      return result;
    }
    return testProductData.data;
  } catch (err) {
    return testProductData.data;
  }
};
