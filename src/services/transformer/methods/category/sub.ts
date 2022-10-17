import { subCategoryCDC, subCategoryTransformed } from 'src/types/category';
import { descriptionTransformer } from '../product/general';
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
export const subCategoryTransformerMethod = async (
  object: subCategoryCDC,
): Promise<object> => {
  const subCategoryObject: subCategoryTransformed = {};
  const {
    TBStyleNo_OS_Category_Master_ID,
    CategorySubName,
    Description,
    seo_description,
    seo_title,
  } = object;

  subCategoryObject['id'] = TBStyleNo_OS_Category_Master_ID?.toString();
  subCategoryObject['name'] = CategorySubName?.toString();
  subCategoryObject['description'] = descriptionTransformer(Description);
  subCategoryObject['seo_description'] = seo_description?.toString();
  subCategoryObject['seo_title'] = seo_title?.toString();

  return subCategoryObject;
};
