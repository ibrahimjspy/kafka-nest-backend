import { Injectable, Param } from '@nestjs/common';
import { fetchMasterCategoryId } from 'src/postgres/handlers/category';
import {
  masterCategoryDto,
  masterCategoryTransformed,
  subCategoryDto,
  subCategoryTransformed,
} from 'src/types/transformers/category';
import { ProductTransformerService } from '../product/Product.transformer';

/**
 *  Injectable class handling category transform ( sub and master)
 *  @Injected product transformation class for description transformer
 *  @requires Injectable in app scope or in kafka connection to access kafka messages
 */
@Injectable()
export class CategoryTransformerService {
  constructor(private readonly productTransformer: ProductTransformerService) {}

  public healthCheck(): string {
    return 'Service running';
  }

  /**
   * transforms and validates categoryMaster responses and existence
   * @value id
   * @value description
   * @value name
   * @value seo_description
   * @value seo_title
   * @params object,  Composite object containing cdc changeData, categoryMaster data
   * @returns transformed object
   */
  public async masterCategoryTransformerMethod(
    @Param() object: masterCategoryDto,
  ) {
    const masterCategoryObject: masterCategoryTransformed = {};
    const {
      TBStyleNo_OS_Category_Master_ID,
      CategoryMasterName,
      Description50,
      seo_description,
      seo_title,
    } = object;

    masterCategoryObject['id'] = TBStyleNo_OS_Category_Master_ID?.toString();
    masterCategoryObject['name'] = CategoryMasterName?.toString();
    masterCategoryObject['description'] =
      await this.productTransformer.descriptionTransformer(Description50);
    masterCategoryObject['seo_description'] = seo_description?.toString();
    masterCategoryObject['seo_title'] = seo_title?.toString().slice(0, 65);

    return masterCategoryObject;
  }

  /**
   * transforms and validates categorySub responses and existence
   * @value id
   * @value description
   * @value name
   * @value seo_description
   * @value seo_title
   * @params object,  Composite object containing cdc changeData, categorySub data
   * @returns transformed object
   */
  public async subCategoryTransformerMethod(@Param() object: subCategoryDto) {
    const subCategoryObject: subCategoryTransformed = {};
    const {
      TBStyleNo_OS_Category_Sub_ID,
      CategorySubName,
      Description50,
      seo_description,
      seo_title,
      TBStyleNo_OS_Category_Master_ID,
    } = object;

    subCategoryObject['id'] = TBStyleNo_OS_Category_Sub_ID?.toString();
    subCategoryObject['parentId'] = await this.masterCategoryIdTransformer(
      TBStyleNo_OS_Category_Master_ID,
    );
    subCategoryObject['name'] = CategorySubName?.toString();
    subCategoryObject['description'] =
      await this.productTransformer.descriptionTransformer(Description50);
    subCategoryObject['seo_description'] = seo_description?.toString();
    subCategoryObject['seo_title'] = seo_title?.toString();

    return subCategoryObject;
  }

  public async masterCategoryIdTransformer(category_id: string) {
    const DEFAULT_MASTER_CATEGORY_ID =
      process.env.DEFAULT_CATEGORY_ID || 'Q2F0ZWdvcnk6MTM=';

    const destinationCategoryId = await fetchMasterCategoryId(category_id);
    if (destinationCategoryId) {
      return destinationCategoryId;
    }

    return DEFAULT_MASTER_CATEGORY_ID;
  }
}
