import { Injectable, Param } from '@nestjs/common';
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
} from 'src/database/postgres/handlers/category';
import {
  masterCategoryDto,
  masterCategoryTransformed,
  subCategoryDto,
  subCategoryTransformed,
} from 'src/transformer/types/category';
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
    @Param() kafkaMessage: masterCategoryDto,
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
    @Param() kafkaMessage: subCategoryDto,
  ): Promise<object> {
    const categoryExistsInDestination: string = await fetchSubCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
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
    @Param() kafkaMessage: masterCategoryDto,
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
    @Param() kafkaMessage: subCategoryDto,
  ): Promise<object> {
    const categoryExistsInDestination: string = await fetchSubCategoryId(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    if (categoryExistsInDestination) {
      await deleteSubCategoryHandler(categoryExistsInDestination);
      await deleteSubCategoryId(kafkaMessage.TBStyleNo_OS_Category_Sub_ID);
    }
    return;
  }

  private async masterCategoryCreate(
    @Param() categoryData: masterCategoryTransformed,
  ) {
    // creates new category and map its id in database
    const category: masterCategoryTransformed =
      await createCategoryMasterHandler(categoryData);

    if (category) {
      await insertMasterCategoryId(categoryData.id, category);
    }

    return { category };
  }

  private async subCategoryCreate(
    @Param() categoryData: subCategoryTransformed,
  ) {
    const subCategory = await createCategorySubHandler(
      categoryData,
      categoryData.parentId,
    );
    const categoryIdMapping = await insertSubCategoryId(
      categoryData.id,
      subCategory,
      categoryData.sourceParentId,
    );
    return { subCategory, categoryIdMapping };
  }
}
