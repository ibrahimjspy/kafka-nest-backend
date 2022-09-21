export const productCategoryTransform = (productObject) => {
  productObject.category.master = 'transformed category';
  productObject.category.sub = 'transformed child category';
  productObject.category.sub.parentID = 'parent category id';
};
