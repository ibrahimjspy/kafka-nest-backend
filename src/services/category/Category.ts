import { Injectable } from '@nestjs/common';
import {
  createCategoryMasterHandler,
  createCategorySubHandler,
  deleteMasterCategoryHandler,
  deleteSubCategoryHandler,
  updateMasterCategoryHandler,
  updateSubCategoryHandler,
} from 'src/graphql/handlers/category';
import {
  deleteMasterCategoryId,
  deleteSubCategoryId,
  fetchMasterCategoryId,
  fetchSubCategoryId,
} from 'src/postgres/handlers/category';
import { masterCategoryCDC, subCategoryCDC } from 'src/types/Category';
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

  public async handleMasterCategoryCDC(
    kafkaMessage: masterCategoryCDC,
  ): Promise<object> {
    // console.log(kafkaMessage);
    const categoryExistsInDestination: string = await fetchMasterCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    // console.log(categoryExistsInDestination);
    if (categoryExistsInDestination) {
      await this.transformerService.categoryTransformer(kafkaMessage);
      return updateMasterCategoryHandler(
        kafkaMessage,
        categoryExistsInDestination,
      );
    }
    return createCategoryMasterHandler(kafkaMessage);
  }

  public async handleSubCategoryCDC(
    kafkaMessage: subCategoryCDC,
  ): Promise<object> {
    // console.log(kafkaMessage);
    const categoryExistsInDestination: string = await fetchSubCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
    );
    if (categoryExistsInDestination) {
      await this.transformerService.categoryTransformer(kafkaMessage);
      return updateSubCategoryHandler(
        kafkaMessage,
        categoryExistsInDestination,
      );
    }
    const parentCategoryId = await fetchMasterCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    return createCategorySubHandler(kafkaMessage, parentCategoryId);
  }

  public async handleMasterCategoryCDCDelete(
    kafkaMessage: masterCategoryCDC,
  ): Promise<object> {
    const categoryExistsInDestination: string = await fetchMasterCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    if (categoryExistsInDestination) {
      await deleteMasterCategoryHandler(categoryExistsInDestination);
      await deleteMasterCategoryId(
        kafkaMessage.TBStyleNo_OS_Category_Master_ID,
      );
    }
    return;
  }

  public async handleSubCategoryCDCDelete(
    kafkaMessage: subCategoryCDC,
  ): Promise<object> {
    const categoryExistsInDestination: string = await fetchSubCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
    );
    if (categoryExistsInDestination) {
      await deleteSubCategoryHandler(categoryExistsInDestination);
      await deleteSubCategoryId(kafkaMessage.TBStyleNo_OS_Category_Sub_ID);
    }
    return;
  }
}
