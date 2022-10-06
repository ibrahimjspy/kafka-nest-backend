export const productCategoryTransformer = (object) => {
  object.category.master = 'transformed category';
  object.category.sub = 'transformed child category';
  object.category.sub.parentID = 'parent category id';
};
