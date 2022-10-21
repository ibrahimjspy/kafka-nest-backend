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
  insertMasterCategoryId,
  insertSubCategoryId,
} from 'src/postgres/handlers/category';
import {
  masterCategoryCDC,
  masterCategoryTransformed,
  subCategoryCDC,
  subCategoryTransformed,
} from 'src/types/category';
import { TransformerService } from '../../transformer/Transformer.service';
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
    const categoryExistsInDestination: string = await fetchMasterCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    const categoryData =
      await this.transformerService.masterCategoryTransformer(kafkaMessage);

    if (categoryExistsInDestination) {
      return updateMasterCategoryHandler(
        categoryData,
        categoryExistsInDestination,
      );
    }
    return this.masterCategoryCreate(categoryData);
  }

  public async handleSubCategoryCDC(
    kafkaMessage: subCategoryCDC,
  ): Promise<object> {
    const categoryExistsInDestination: string = await fetchSubCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
    );
    const categoryData = await this.transformerService.subCategoryTransformer(
      kafkaMessage,
    );

    if (categoryExistsInDestination) {
      return updateSubCategoryHandler(
        categoryData,
        categoryExistsInDestination,
      );
    }

    return this.subCategoryCreate(categoryData);
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

  private async masterCategoryCreate(categoryData) {
    // creates new category and map its id in database
    const category: masterCategoryTransformed =
      await createCategoryMasterHandler(categoryData);
    const categoryIdMapping = await insertMasterCategoryId(
      categoryData.id,
      category,
    );
    return { category, categoryIdMapping };
  }

  private async subCategoryCreate(categoryData: subCategoryTransformed) {
    // creates new category and map its id in database
    const parentCategoryId = await fetchMasterCategoryId(
      categoryData.parent_id,
    );
    const subCategory = await createCategorySubHandler(
      categoryData,
      parentCategoryId,
    );
    const categoryIdMapping = await insertSubCategoryId(
      categoryData.id,
      subCategory,
    );
    return { subCategory, categoryIdMapping };
  }
}
