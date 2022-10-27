export interface productDto {
  id: number;
  nStyleName: string;
  nItemDescription: string;
  TBItem_ID: string;
}

export interface productTransformed {
  id?: string;
  name?: string;
  description?: string;
}

export interface colorSelectDto {
  id: number;
  TBColorSelect_ID: string;
  TBItem_ID: string;
  TBColor_ID: string;
  ImageLink: string;
  BrandActive: string;
}
