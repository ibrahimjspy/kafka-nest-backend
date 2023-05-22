export interface masterCategoryDto {
  id?: number;
  TBStyleNo_OS_Category_Master_ID: string;
  CategoryMasterName: string;
  Description: string;
  url: any;
  seo_description: string;
  seo_title: string;
  Description50?: string;
  DisplayGroup?: string;
}

export interface masterCategoryTransformed {
  id?: string;
  name?: string;
  description?: string;
  url?: string;
  seo_description?: string;
  seo_title?: string;
  groupId?: string;
}

export interface subCategoryDto {
  id: number;
  TBStyleNo_OS_Category_Sub_ID: string;
  TBStyleNo_OS_Category_Master_ID: string;
  CategorySubName: string;
  Description: string;
  url: any;
  seo_description: string;
  seo_title: string;
  Description50?: string;
}

export interface subCategoryTransformed {
  id?: string;
  parentId?: string;
  name?: string;
  description?: string;
  url?: string;
  seo_description?: string;
  seo_title?: string;
  sourceParentId?: string; // from database
}
