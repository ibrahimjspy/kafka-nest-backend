export interface productExistingInterface {
  exists: boolean;
  destinationId: string;
}
export interface productCDC {
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
