export interface productDto {
  id: number;
  nStyleName: string;
  nItemDescription: string;
  TBItem_ID: string;
  Picture1?: string;
  Picture2?: string;
  Picture3?: string;
  Picture4?: string;
  Picture5?: string;
  Picture6?: string;
  Picture7?: string;
  Picture8?: string;
  Picture9?: string;
}

export interface productTransformed {
  id?: string;
  name?: string;
  description?: string;
  media?: string[];
}

export interface colorSelectDto {
  id: number;
  TBColorSelect_ID: string;
  TBItem_ID: string;
  TBColor_ID: string;
  ImageLink: string;
  BrandActive: string;
}
