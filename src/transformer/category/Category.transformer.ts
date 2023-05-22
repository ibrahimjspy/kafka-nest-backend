import { Injectable, Param } from '@nestjs/common';
import { groupIds } from '../../../mock/category/groupIds';
import {
  masterCategoryDto,
  masterCategoryTransformed,
  subCategoryDto,
  subCategoryTransformed,
} from 'src/transformer/types/category';
import { ProductTransformerService } from '../product/Product.transformer';
import { getMasterCategoryMapping } from 'src/mapping/methods/category';
import { DEFAULT_MASTER_CATEGORY_ID } from '../../../common.env';

/**
 *  Injectable class handling category transform ( sub and master)
 *  @Injected product transformation class for description transformer
 *  @requires Injectable in app scope or in kafka connection to access kafka messages
 */
@Injectable()
export class CategoryTransformerService {
  constructor(private readonly productTransformer: ProductTransformerService) {}

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
      DisplayGroup,
    } = object;

    masterCategoryObject['id'] = TBStyleNo_OS_Category_Master_ID?.toString();
    masterCategoryObject['groupId'] = this.groupIdTransformer(DisplayGroup);
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
    subCategoryObject['sourceParentId'] = TBStyleNo_OS_Category_Master_ID;
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
    const destinationCategoryId = await getMasterCategoryMapping(category_id);
    if (destinationCategoryId) {
      return destinationCategoryId;
    }
    return DEFAULT_MASTER_CATEGORY_ID;
  }

  public groupIdTransformer(groupName: string) {
    return groupIds[groupName] ? groupIds[groupName] : 'Q2F0ZWdvcnk6NjQx';
  }
}
