export interface masterCategoryCDC {
  id: number;
  TBStyleNo_OS_Category_Master_ID: string;
  CategorySubName: string;
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
