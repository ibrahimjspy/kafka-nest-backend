import { Injectable, Param } from '@nestjs/common';
import { retailerDTO, retailerTransformed } from '../types/retailer';

@Injectable()
export class RetailerTransformerService {
  public retailerTransformerMethod(
    @Param() object: retailerDTO,
  ): retailerTransformed {
    // console.dir(object, { depth: null });
    const retailerObject = {};
    const {
      TBCustomer_ID,
      CTCompanyName,
      CTLoginID,
      CTLoginPassword,
      CTCustomerFirstName,
      CTCustomerLastName,
      CTPhone,
      CTAddress1,
      CTState,
    } = object;
    retailerObject['customerId'] = TBCustomer_ID;
    retailerObject['companyName'] = CTCompanyName;
    retailerObject['email'] = CTLoginID;
    retailerObject['password'] = CTLoginPassword;
    retailerObject['firstName'] = CTCustomerFirstName;
    retailerObject['secondName'] = CTCustomerLastName;
    retailerObject['phoneNumber'] = CTPhone
      ? this.retailerPhoneNumberTransformer(CTPhone)
      : null;
    retailerObject['address'] = CTAddress1;
    retailerObject['state'] = CTState;
    retailerObject['name'] = this.fullNameTransformer(
      CTCustomerFirstName,
      CTCustomerLastName,
    );

    return retailerObject;
  }

  public retailerPhoneNumberTransformer(@Param() phoneNumber) {
    const phone = phoneNumber.split(',')[0];
    phone.split('/')[0];
    phone.split('TEXT ONLY')[1];
    const isEmail = /\.COM/;
    if (isEmail.test(phoneNumber)) {
      return '1234';
    }
    return `+1${phone.replace(/[()-]/g, '').split(' ').join('')}`;
  }

  public fullNameTransformer(firstName, secondName) {
    if (firstName && secondName) {
      return `${firstName} ${secondName}`;
    }
    return firstName;
  }
}
