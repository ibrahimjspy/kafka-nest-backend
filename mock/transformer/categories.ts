import {
  masterCategoryDto,
  masterCategoryTransformed,
  subCategoryDto,
  subCategoryTransformed,
} from 'src/transformer/types/category';

export const masterCategoryCDCMock: masterCategoryDto = {
  CategoryMasterName: 'name',
  TBStyleNo_OS_Category_Master_ID: '3',
  seo_title: 'seo title',
  seo_description: 'seo description',
  url: 'http/test',
  id: 3,
  Description: 'test description',
  Description50: 'test',
};

export const CategoryTransformedMock: masterCategoryTransformed = {
  id: '3',
  name: 'name',
  description:
    '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "test description"}, "type": "paragraph"}], "version": "2.24.3"}',
  seo_description: 'seo description',
  seo_title: 'seo title',
};

export const subCategoryCDCMock: subCategoryDto = {
  CategorySubName: 'name',
  TBStyleNo_OS_Category_Master_ID: '3',
  TBStyleNo_OS_Category_Sub_ID: '5',
  seo_title: 'seo title',
  seo_description: 'seo description',
  url: 'http/test',
  id: 3,
  Description: 'test description',
  Description50: 'test description',
};

export const subCategoryExpected: subCategoryTransformed = {
  id: '5',
  sourceParentId: '3',
  parentId: 'Q2F0ZWdvcnk6MTY=',
  name: 'name',
  description:
    '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "test description"}, "type": "paragraph"}], "version": "2.24.3"}',
  seo_description: 'seo description',
  seo_title: 'seo title',
};
