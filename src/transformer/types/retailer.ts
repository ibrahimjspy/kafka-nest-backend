export interface retailerDTO {
  TBCustomer_ID: string;
  CTCompanyName: string;
  CTLoginID: string;
  CTLoginPassword: string;
  CTCustomerFirstName: string;
  CTCustomerLastName: string;
  CTAddress1: string;
  CTState: string;
  CTCountry: string;
  CTSHOWorLOCAL: string;
  CTCreditLimitLine: number;
  ReceiveEmail: string;
  CTPhone?: string;
}

export interface retailerTransformed {
  customerId?: string;
  companyName?: string;
  email?: string;
  password?: string;
  firstName?: string;
  secondName?: string;
  phoneNumber?: string;
  address?: string;
  state?: string;
  name?: string;
}
