import { Injectable, Param } from '@nestjs/common';
import {
  createMasterCategoryHandler,
  createSubCategoryHandler,
  deleteMasterCategoryHandler,
  deleteSubCategoryHandler,
  updateMasterCategoryHandler,
  updateSubCategoryHandler,
} from 'src/graphql/handlers/category';
import {
  masterCategoryDto,
  masterCategoryTransformed,
  subCategoryDto,
  subCategoryTransformed,
} from 'src/transformer/types/category';
import { TransformerService } from '../../transformer/Transformer.service';
import {
  addMasterCategoryMapping,
  addSubCategoryMapping,
  getMasterCategoryMapping,
  getSubCategoryMapping,
  removeMasterCategoryMapping,
  removeSubCategoryMapping,
} from 'src/mapping/methods/category';

/**
 *  Injectable class handling category and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class CategoryService {
  constructor(private readonly transformerService: TransformerService) {}

  public async handleMasterCategoryCDC(
    @Param() kafkaMessage: masterCategoryDto,
  ): Promise<any> {
    const categoryData =
      await this.transformerService.masterCategoryTransformer(kafkaMessage);

    const mappingExists: string = await getMasterCategoryMapping(
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    if (mappingExists) {
      return await updateMasterCategoryHandler(categoryData, mappingExists);
    }
    return await this.masterCategoryCreate(categoryData);
  }

  public async handleSubCategoryCDC(
    @Param() kafkaMessage: subCategoryDto,
  ): Promise<any> {
    const categoryData = await this.transformerService.subCategoryTransformer(
      kafkaMessage,
    );
    const mappingExists: string = await getSubCategoryMapping(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    console.log(mappingExists);
    if (mappingExists) {
      return;
      return await updateSubCategoryHandler(categoryData, mappingExists);
    }
    return await this.subCategoryCreate(categoryData);
  }

  public async handleMasterCategoryCDCDelete(
    @Param() kafkaMessage: masterCategoryDto,
  ): Promise<object> {
    const categoryExistsInDestination: string = await getMasterCategoryMapping(
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    if (categoryExistsInDestination) {
      await deleteMasterCategoryHandler(categoryExistsInDestination);
      await removeMasterCategoryMapping(categoryExistsInDestination);
    }
    return;
  }

  public async handleSubCategoryCDCDelete(
    @Param() kafkaMessage: subCategoryDto,
  ): Promise<object> {
    const categoryExistsInDestination: string = await getSubCategoryMapping(
      kafkaMessage.TBStyleNo_OS_Category_Sub_ID,
      kafkaMessage.TBStyleNo_OS_Category_Master_ID,
    );
    if (categoryExistsInDestination) {
      await deleteSubCategoryHandler(categoryExistsInDestination);
      await removeSubCategoryMapping(categoryExistsInDestination);
    }
    return;
  }

  private async masterCategoryCreate(
    @Param() categoryData: masterCategoryTransformed,
  ) {
    // creates new category and map its id in database
    const category = await createMasterCategoryHandler(categoryData);

    if (category) {
      await addMasterCategoryMapping(categoryData.id, category['id']);
    }

    return { category };
  }

  private async subCategoryCreate(
    @Param() categoryData: subCategoryTransformed,
  ) {
    const subCategory = await createSubCategoryHandler(
      categoryData,
      categoryData.parentId,
    );
    const categoryIdMapping = await addSubCategoryMapping(
      categoryData.id,
      subCategory,
      categoryData.parentId,
      categoryData.sourceParentId,
    );
    return { subCategory, categoryIdMapping };
  }
}
