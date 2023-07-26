import { Injectable, Param } from '@nestjs/common';
import {
  createCollectionHandler,
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
import {
  fetchEventProducts,
  fetchMasterEventDetails,
  fetchSubEventDetails,
} from 'src/database/mssql/api_methods/collections';
import { getDestinationProductIds } from 'src/mapping/methods/product';
import { ApplicationLogger } from 'src/logger/Logger.service';

/**
 *  Injectable class handling category and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class CategoryService {
  constructor(
    private readonly transformerService: TransformerService,
    public logger: ApplicationLogger,
  ) {}

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
    if (mappingExists) {
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

  /**
   * Create a collection based on the provided subCollectionId.
   *
   * @param {string} subCollectionId - The subCollectionId to create the collection for.
   * @returns {Promise<any>} - A promise that resolves to the created collection details.
   */
  public async collectionCreate(
    @Param() subCollectionId: string,
  ): Promise<any> {
    try {
      // Fetch event details for the subCollectionId
      const eventDetails = await fetchSubEventDetails(subCollectionId);

      // Fetch master products for the subCollectionId
      const masterProducts = await fetchEventProducts(subCollectionId);

      // Fetch master event details based on the TBEventPageMaster_ID from eventDetails
      const masterEventDetails = await fetchMasterEventDetails(
        eventDetails.TBEventPageMaster_ID,
      );

      // Fetch destination product IDs for the master products
      const destinationProductIds = await getDestinationProductIds(
        masterProducts.map((item) => item.TBItem_ID),
      );

      // Create the collection using the collected data
      const createCollection = await createCollectionHandler({
        name: eventDetails.eventsubtitle,
        sourceId: eventDetails.TBEventPageSubmaster_ID,
        products: destinationProductIds,
        backgroundImage: eventDetails.SubImage,
        masterImage: masterEventDetails.MasterImage,
        banner: masterEventDetails.desktop_main_banner,
        listImage: masterEventDetails.listimage,
      });

      return createCollection;
    } catch (error) {
      this.logger.error(`Error creating collection: ${error.message}`);
      throw new Error('Failed to create collection'); // Throw an error to be handled at a higher level
    }
  }
}
