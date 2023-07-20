import { Injectable } from '@nestjs/common';
import { ApplicationLogger } from 'src/logger/Logger.service';
import { getBundleIdsHandler } from 'src/graphql/handlers/bundle';
/**
 *  Injectable class handling media assign
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductValidationService {
  constructor(public logger: ApplicationLogger) {}
  /**
   * validates whether created product is valid or not
   * it checks whether bundles, variants are created correctly
   * @param destinationProduct :: string -- product id in saleor that is created
   */
  public async validateCreatedProduct(
    destinationProduct: string,
  ): Promise<boolean> {
    this.logger.log('Validating created product', destinationProduct);
    return await this.validateCreatedBundles(destinationProduct);
  }

  /**
   * validates whether created product has bundles created or not
   * @param destinationProduct :: string -- product id in saleor that is created
   */
  private async validateCreatedBundles(
    destinationProductId: string,
  ): Promise<boolean> {
    const createdBundles = await getBundleIdsHandler(destinationProductId);
    if (createdBundles.length) {
      return false;
    }
    return true;
  }
}
