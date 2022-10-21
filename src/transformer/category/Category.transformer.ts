import { Injectable } from '@nestjs/common';
import {
  masterCategoryCDC,
  masterCategoryTransformed,
  subCategoryCDC,
  subCategoryTransformed,
} from 'src/types/category';
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
  public async masterCategoryTransformerMethod(object: masterCategoryCDC) {
    const masterCategoryObject: masterCategoryTransformed = {};
    const {
      TBStyleNo_OS_Category_Master_ID,
      CategoryMasterName,
      Description,
      seo_description,
      seo_title,
    } = object;

    masterCategoryObject['id'] = TBStyleNo_OS_Category_Master_ID?.toString();
    masterCategoryObject['name'] = CategoryMasterName?.toString();
    masterCategoryObject['description'] =
      await this.productTransformer.descriptionTransformer(Description);
    masterCategoryObject['seo_description'] = seo_description?.toString();
    masterCategoryObject['seo_title'] = seo_title?.toString();

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
  public async subCategoryTransformerMethod(object: subCategoryCDC) {
    const subCategoryObject: subCategoryTransformed = {};
    const {
      TBStyleNo_OS_Category_Sub_ID,
      CategorySubName,
      Description,
      seo_description,
      seo_title,
    } = object;

    subCategoryObject['id'] = TBStyleNo_OS_Category_Sub_ID?.toString();
    subCategoryObject['name'] = CategorySubName?.toString();
    subCategoryObject['description'] =
      await this.productTransformer.descriptionTransformer(Description);
    subCategoryObject['seo_description'] = seo_description?.toString();
    subCategoryObject['seo_title'] = seo_title?.toString();

    return subCategoryObject;
  }
}
