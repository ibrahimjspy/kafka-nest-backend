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
  constructor(private readonly transformerService: TransformerService) {}

  public healthCheck(): string {
    return 'Service running';
  }

  public async handleMasterCategoryCDC(kafkaMessage): Promise<object> {
    const categoryExistsInDestination = await fetchMasterCategoryId(
      kafkaMessage.id,
    );
    if (categoryExistsInDestination) {
      await this.transformerService.categoryTransformer(kafkaMessage);
      return updateCategoryHandler(kafkaMessage, categoryExistsInDestination);
    }
    return createCategoryMasterHandler(kafkaMessage);
  }

  public async handleSubCategoryCDC(kafkaMessage): Promise<object> {
    const categoryExistsInDestination = await fetchSubCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
    );
    if (categoryExistsInDestination) {
      await this.transformerService.categoryTransformer(kafkaMessage);
      return updateCategoryHandler(kafkaMessage, categoryExistsInDestination);
    }
    const parentCategoryId = await fetchMasterCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    return createCategorySubHandler(kafkaMessage, parentCategoryId);
  }
}
