export interface masterCategoryCDC {
  id?: number;
  TBStyleNo_OS_Category_Master_ID: string;
  CategoryMasterName: string;
  Description: string;
  url: any;
  seo_description: string;
  seo_title: string;
}

export interface subCategoryCDC {
  id: number;
  TBStyleNo_OS_Category_Sub_ID: string;
  TBStyleNo_OS_Category_Master_ID: string;
  CategorySubName: string;
  Description: string;
  url: any;
  seo_description: string;
  seo_title: string;
}

export interface masterCategoryTransformed {
  id?: string;
  name?: string;
  description?: string;
  url?: string;
  seo_description?: string;
  seo_title?: string;
}

export interface subCategoryTransformed {
  id?: string;
  parent_id?: string;
  name?: string;
  description?: string;
  url?: string;
  seo_description?: string;
  seo_title?: string;
}
