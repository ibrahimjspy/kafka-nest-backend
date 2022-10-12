import {
  masterCategoryCDC,
  masterCategoryTransformed,
} from 'src/types/Category';
import { descriptionTransformer } from '../product/general';

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
export const masterCategoryTransformer = async (
  object: masterCategoryCDC,
): Promise<object> => {
  const masterCategoryObject: masterCategoryTransformed = {};
  const {
    TBStyleNo_OS_Category_Master_ID,
    CategoryMasterName,
    Description,
    seo_description,
    seo_title,
  } = object;

  masterCategoryObject['id'] = TBStyleNo_OS_Category_Master_ID.toString();
  masterCategoryObject['name'] = CategoryMasterName.toString();
  masterCategoryObject['description'] = descriptionTransformer(Description);
  masterCategoryObject['seo_description'] = seo_description.toString();
  masterCategoryObject['seo_title'] = seo_title.toString();

  return masterCategoryObject;
};
