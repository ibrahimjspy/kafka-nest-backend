import { Injectable } from '@nestjs/common';
import {
  createCategoryMasterHandler,
  createCategorySubHandler,
  updateCategoryHandler,
} from 'src/graphql/handlers/category';
import {
  fetchMasterCategoryId,
  fetchSubCategoryId,
} from 'src/postgres/handlers/category';
import { TransformerService } from '../transformer/Transformer';
/**
 *  Injectable class handling category and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class CategoryService {
  constructor(
    private readonly productModelTransformerClass: TransformerService,
  ) {}

  public healthCheck(): string {
    return 'Service running';
  }

  public async handleMasterCategoryCDC(kafkaMessage): Promise<object> {
    const categoryExistsInDestination = await fetchMasterCategoryId(
      kafkaMessage.id,
    );
    if (categoryExistsInDestination) {
      await this.productModelTransformerClass.productTransformer(kafkaMessage);
      return updateCategoryHandler(kafkaMessage, categoryExistsInDestination);
    }
    return createCategoryMasterHandler(kafkaMessage);
  }

  public async handleSubCategoryCDC(kafkaMessage): Promise<object> {
    const categoryExistsInDestination = await fetchSubCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
    );
    const parentCategoryId = await fetchMasterCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    if (categoryExistsInDestination) {
      await this.productModelTransformerClass.productTransformer(kafkaMessage);
      return updateCategoryHandler(kafkaMessage, categoryExistsInDestination);
    }
    return createCategorySubHandler(kafkaMessage, parentCategoryId);
  }
}
