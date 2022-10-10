import { subCategoryCDC, subCategoryTransformed } from 'src/types/Category';
/**
 * transforms and validates categorySub responses and existence
 * @value id
 * @value description
 * @value name
 * @value seo_description
 * @value seo_title
 * @params object,  Composite object containing cdc changeData, categorySub data
 */
export const subCategoryTransformer = async (
  object: subCategoryCDC,
): Promise<object> => {
  const subCategoryObject: subCategoryTransformed = {};

  subCategoryObject['id'] = object.TBStyleNo_OS_Category_Master_ID;
  subCategoryObject['name'] = object.CategorySubName;
  subCategoryObject['description'] = object.Description;
  subCategoryObject['seo_description'] = object.seo_description;
  subCategoryObject['seo_title'] = object.seo_description;

  return subCategoryObject;
};
