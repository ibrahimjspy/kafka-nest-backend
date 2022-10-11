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
 */
export const masterCategoryTransformer = async (
  object: masterCategoryCDC,
): Promise<object> => {
  const masterCategoryObject: masterCategoryTransformed = {};

  masterCategoryObject['id'] = object.TBStyleNo_OS_Category_Master_ID;
  masterCategoryObject['name'] = object.CategoryMasterName;
  masterCategoryObject['description'] = descriptionTransformer(
    object.Description,
  );
  masterCategoryObject['seo_description'] = object.seo_description;
  masterCategoryObject['seo_title'] = object.seo_description;

  return masterCategoryObject;
};
